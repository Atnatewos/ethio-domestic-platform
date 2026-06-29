// File path: /server/services/trustScore.service.js
// Purpose: Trust Score calculation engine - the core value proposition of the platform.
// Architecture: Config-driven scoring with weighted factors and tier classification.

const { query } = require('../lib/db');
const configService = require('../lib/configService');

class TrustScoreService {
  /**
   * Calculate and update trust score for a worker
   * @param {string} workerId - The worker's UUID
   * @returns {Object} - The calculated trust score with breakdown
   */
  async calculateTrustScore(workerId) {
    try {
      // Get worker data
      const workerResult = await query(
        `SELECT 
          verification_status,
          police_clearance_url,
          health_certificate_url,
          id_document_url,
          health_certificate_expiry
         FROM workers 
         WHERE id = $1`,
        [workerId]
      );

      if (workerResult.rows.length === 0) {
        throw new Error('Worker not found');
      }

      const worker = workerResult.rows[0];
      const config = configService.get('trustScore');
      
      let totalScore = 0;
      const breakdown = {};

      // 1. Verification Completion (50 points max)
      const verificationScore = this.calculateVerificationScore(worker, config);
      breakdown.verification = verificationScore;
      totalScore += verificationScore;

      // 2. Reference Check Quality (20 points max)
      const referenceScore = await this.calculateReferenceScore(workerId, config);
      breakdown.references = referenceScore;
      totalScore += referenceScore;

      // 3. Employer Reviews (20 points max)
      const reviewScore = await this.calculateReviewScore(workerId, config);
      breakdown.reviews = reviewScore;
      totalScore += reviewScore;

      // 4. Response Rate (10 points max)
      const responseScore = await this.calculateResponseRate(workerId, config);
      breakdown.responseRate = responseScore;
      totalScore += responseScore;

      // 5. Community Vouches (15 points bonus)
      const vouchScore = await this.calculateVouchScore(workerId, config);
      breakdown.vouches = vouchScore;
      totalScore += vouchScore;

      // Determine tier
      const tier = this.determineTier(totalScore, config);

      // Update database
      const trustScoreData = {
        total: totalScore,
        tier: tier.name,
        breakdown: breakdown,
        calculatedAt: new Date().toISOString()
      };

      await query(
        `UPDATE workers 
         SET trust_score = $1, updated_at = NOW()
         WHERE id = $2`,
        [JSON.stringify(trustScoreData), workerId]
      );

      return trustScoreData;
    } catch (error) {
      console.error('Trust score calculation error:', error);
      throw error;
    }
  }

  /**
   * Calculate verification completion score
   */
  calculateVerificationScore(worker, config) {
    let score = 0;

    // Police clearance (20 points)
    if (worker.police_clearance_url) {
      score += config.verification.policeClearance.points;
    }

    // Health certificate (15 points)
    if (worker.health_certificate_url) {
      // Check if expired
      const expiryDate = new Date(worker.health_certificate_expiry);
      const now = new Date();
      const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));

      if (daysUntilExpiry > 0) {
        score += config.verification.healthCertificate.points;
      }
    }

    // ID document (15 points)
    if (worker.id_document_url) {
      score += config.verification.idDocument.points;
    }

    return score;
  }

  /**
   * Calculate reference check quality score
   */
  async calculateReferenceScore(workerId, config) {
    const logsResult = await query(
      `SELECT result FROM verification_logs 
       WHERE worker_id = $1 AND check_type = 'reference_check'`,
      [workerId]
    );

    if (logsResult.rows.length === 0) {
      return 0;
    }

    const results = logsResult.rows.map(row => row.result);
    const positiveCount = results.filter(r => r === 'passed').length;
    const totalCount = results.length;

    if (totalCount === 0) return 0;

    const positiveRatio = positiveCount / totalCount;

    if (positiveRatio >= 0.8) {
      return config.references.allPositive.points;
    } else if (positiveRatio >= 0.5) {
      return config.references.mixed.points;
    } else if (positiveRatio === 0) {
      return config.references.unableToVerify.points;
    }

    return 0;
  }

  /**
   * Calculate employer review score
   */
  async calculateReviewScore(workerId, config) {
    const reviewsResult = await query(
      `SELECT AVG(rating) as avg_rating, COUNT(*) as review_count
       FROM reviews 
       WHERE worker_id = $1`,
      [workerId]
    );

    if (reviewsResult.rows.length === 0 || reviewsResult.rows[0].review_count === 0) {
      return 0;
    }

    const avgRating = parseFloat(reviewsResult.rows[0].avg_rating);

    if (avgRating >= config.reviews.excellent.minRating) {
      return config.reviews.excellent.points;
    } else if (avgRating >= config.reviews.good.minRating) {
      return config.reviews.good.points;
    } else if (avgRating >= config.reviews.average.minRating) {
      return config.reviews.average.points;
    } else {
      return config.reviews.poor.points;
    }
  }

  /**
   * Calculate response rate score
   */
  async calculateResponseRate(workerId, config) {
    const appsResult = await query(
      `SELECT 
        status_history,
        created_at
       FROM applications 
       WHERE worker_id = $1 
       AND status_history IS NOT NULL
       AND status_history != '[]'::jsonb`,
      [workerId]
    );

    if (appsResult.rows.length === 0) {
      return config.responseRate.slow.points;
    }

    let fastResponses = 0;
    let mediumResponses = 0;
    let totalApps = 0;

    appsResult.rows.forEach(app => {
      const history = app.status_history;
      if (Array.isArray(history) && history.length > 1) {
        totalApps++;
        
        // Find first status change after 'applied'
        const appliedAt = new Date(app.created_at);
        const firstChange = history.find(h => h.status !== 'applied');
        
        if (firstChange) {
          const changedAt = new Date(firstChange.at);
          const hoursDiff = (changedAt - appliedAt) / (1000 * 60 * 60);
          
          if (hoursDiff <= 24) {
            fastResponses++;
          } else if (hoursDiff <= 48) {
            mediumResponses++;
          }
        }
      }
    });

    if (totalApps === 0) return config.responseRate.slow.points;

    const fastRatio = fastResponses / totalApps;
    const mediumRatio = mediumResponses / totalApps;

    if (fastRatio >= 0.7) {
      return config.responseRate.within24Hours.points;
    } else if (fastRatio + mediumRatio >= 0.5) {
      return config.responseRate.within48Hours.points;
    } else {
      return config.responseRate.slow.points;
    }
  }

  /**
   * Calculate community vouch bonus
   */
  async calculateVouchScore(workerId, config) {
    const vouchResult = await query(
      `SELECT COUNT(DISTINCT employer_id) as vouch_count
       FROM reviews 
       WHERE worker_id = $1 AND rating >= 4`,
      [workerId]
    );

    const vouchCount = parseInt(vouchResult.rows[0].vouch_count);

    if (vouchCount >= config.vouching.requiredVouches) {
      return config.vouching.bonusPoints;
    }

    return 0;
  }

  /**
   * Determine trust tier based on score
   */
  determineTier(score, config) {
    const tiers = config.tiers;
    
    for (const tier of tiers) {
      if (score >= tier.minScore && score <= tier.maxScore) {
        return tier;
      }
    }

    return tiers[tiers.length - 1]; // Default to lowest tier
  }

  /**
   * Get worker's current trust score
   */
  async getTrustScore(workerId) {
    const result = await query(
      'SELECT trust_score FROM workers WHERE id = $1',
      [workerId]
    );

    if (result.rows.length === 0) {
      throw new Error('Worker not found');
    }

    return result.rows[0].trust_score;
  }
}

module.exports = new TrustScoreService();