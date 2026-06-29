// File path: /db/seed-test-data.js
// Purpose: Seed test data with retry logic for serverless databases
// Usage: node db/seed-test-data.js

const { query, pool } = require('../server/lib/db');

async function seedTestData() {
  console.log('📊 Seeding test data...\n');

  try {
    // Clear existing test data
    console.log('🗑️  Clearing existing test data...');
    await query('DELETE FROM verification_logs');
    await query('DELETE FROM notifications');
    await query('DELETE FROM payments');
    await query('DELETE FROM reviews');
    await query('DELETE FROM applications');
    await query('DELETE FROM jobs');
    await query("DELETE FROM employers WHERE email LIKE '%example.com'");
    await query("DELETE FROM workers WHERE phone LIKE '+2519%'");
    console.log('✅ Cleared\n');

    const passwordHash = '$2a$10$rKvQhJ8xYzZzZzZzZzZzZuQvXzZzZzZzZzZzZzZzZzZzZzZzZzZzZ';

    // ============================================
    // WORKERS
    // ============================================
    console.log('👷 Inserting workers...');
    const workers = [
      ['+251911234567','Abebe Kebede',28,'male','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop','Kebede Abebe','+251911234568','parent','bole','01','maid','secondary',5,['amharic','english'],['cooking_ethiopian','cleaning_deep','childcare_toddlers'],'full_time',5000,7000,[{employerName:'John Smith',employerPhone:'+251911111111',yearsWorked:2,relationship:'Maid'}],'approved','verified','https://example.com/police1.pdf','https://example.com/health1.pdf','https://example.com/id1.pdf',{total:92,tier:'premium',breakdown:{verification:50,references:20,reviews:20,responseRate:10,vouches:15}}],
      ['+251922345678','Sara Mohammed',32,'female','https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop','Mohammed Ali','+251922345679','spouse','kirkos','05','nanny','certificate',7,['amharic','oromo','english'],['childcare_infants','childcare_toddlers','cooking_ethiopian'],'live_in',7000,10000,[{employerName:'Sarah Johnson',employerPhone:'+251922222222',yearsWorked:3,relationship:'Nanny'}],'approved','verified','https://example.com/police2.pdf','https://example.com/health2.pdf','https://example.com/id2.pdf',{total:68,tier:'verified',breakdown:{verification:50,references:20,reviews:15,responseRate:5,vouches:0}}],
      ['+251933456789','Dawit Tadesse',25,'male','https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop','Tadesse Bekele','+251933456790','parent','yeka','12','driver','secondary',3,['amharic','english'],['driving_license'],'part_time',4000,6000,[{employerName:'ABC Company',employerPhone:'+251933333333',yearsWorked:2,relationship:'Driver'}],'approved','approved','https://example.com/police3.pdf',null,'https://example.com/id3.pdf',{total:35,tier:'inProgress',breakdown:{verification:35,references:0,reviews:0,responseRate:0,vouches:0}}],
      ['+251944567890','Hanna Getachew',29,'female',null,'Getachew Tesfaye','+251944567891','sibling','arada','03','cook','primary',4,['amharic','oromo'],['cooking_ethiopian','cooking_international'],'live_out',5000,8000,[],'payment_pending','draft',null,null,null,{total:0,tier:'new',breakdown:{}}],
      ['+251955678901','Meron Haile',35,'female','https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop','Haile Selassie','+251955678902','spouse','gulele','08','cook','certificate',10,['amharic','english','tigre'],['cooking_ethiopian','cooking_international','first_aid'],'full_time',8000,12000,[{employerName:'International Hotel',employerPhone:'+251955555555',yearsWorked:5,relationship:'Cook'}],'approved','verified','https://example.com/police5.pdf','https://example.com/health5.pdf','https://example.com/id5.pdf',{total:95,tier:'premium',breakdown:{verification:50,references:20,reviews:20,responseRate:10,vouches:15}}],
      ['+2519600000001','Tigist Alemu',26,'female',null,'Alemu Worku','+2519600000011','parent','bole',null,'maid','primary',2,['amharic','english'],[],'full_time',3000,5000,[],'approved','verified',null,null,null,{total:85,tier:'premium',breakdown:{verification:50,references:20,reviews:15,responseRate:10,vouches:0}}],
      ['+2519600000002','Beza Kebede',27,'female',null,'Kebede Mulu','+2519600000022','sibling','kirkos',null,'cleaner','secondary',3,['amharic','english'],[],'part_time',3500,5500,[],'approved','verified',null,null,null,{total:72,tier:'verified',breakdown:{verification:50,references:20,reviews:10,responseRate:5,vouches:0}}],
      ['+2519600000003','Solomon Tesfaye',28,'male',null,'Tesfaye Girma','+2519600000033','parent','yeka',null,'guard','certificate',4,['amharic','english'],[],'live_in',4000,6000,[],'approved','approved',null,null,null,{total:40,tier:'inProgress',breakdown:{verification:40,references:0,reviews:0,responseRate:0,vouches:0}}],
      ['+2519600000004','Rahel Mohammed',29,'female',null,'Mohammed Hassan','+2519600000044','spouse','arada',null,'nanny','primary',5,['amharic','english'],[],'live_out',4500,6500,[],'approved','draft',null,null,null,{total:5,tier:'new',breakdown:{}}],
      ['+2519600000005','Yonas Bekele',30,'male',null,'Bekele Assefa','+2519600000055','parent','gulele',null,'driver','secondary',6,['amharic','english'],[],'full_time',5000,7000,[],'approved','verified',null,null,null,{total:65,tier:'verified',breakdown:{verification:50,references:15,reviews:0,responseRate:0,vouches:0}}]
    ];

    for (const w of workers) {
      await query(
        `INSERT INTO workers (phone,password_hash,full_name,age,gender,photo_url,emergency_contact_name,emergency_contact_phone,emergency_contact_relationship,zone,woreda,worker_type,education_level,years_experience,languages,skills,availability,salary_expectation_min,salary_expectation_max,previous_employers,registration_status,verification_status,is_active,police_clearance_url,health_certificate_url,id_document_url,trust_score,created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,true,$23,$24,$25,$26,NOW()-INTERVAL '30 days')`,
        [w[0],passwordHash,w[1],w[2],w[3],w[4],w[5],w[6],w[7],w[8],w[9],w[10],w[11],w[12],w[13],w[14],w[15],w[16],w[17],JSON.stringify(w[18]),w[19],w[20],w[21],w[22],w[23],JSON.stringify(w[24])]
      );
    }
    console.log(`✅ ${workers.length} workers\n`);

    // ============================================
    // EMPLOYERS (FIXED: Correct column mapping)
    // ============================================
    console.log('🏢 Inserting employers...');
    
    // Explicitly define employer objects to avoid array index errors
    const employersData = [
      { phone: '+251911111111', email: 'employer1@example.com', name: 'Ato Tesfaye Bekele', zone: 'bole', woreda: '02', household: 5, under5: 2, age5to12: 1, elderly: 1, special: false, notes: 'Need experienced nanny' },
      { phone: '+251922222222', email: 'employer2@example.com', name: 'W/ro Selamawit Haile', zone: 'kirkos', woreda: '07', household: 4, under5: 1, age5to12: 2, elderly: 0, special: false, notes: 'Looking for full-time maid' },
      { phone: '+251933333333', email: 'employer3@example.com', name: 'Ato Yonas Tadesse', zone: 'yeka', woreda: '10', household: 3, under5: 0, age5to12: 0, elderly: 0, special: false, notes: 'Need driver with clean record' },
      { phone: '+251944444444', email: 'employer4@example.com', name: 'W/ro Hanna Getachew', zone: 'arada', woreda: '04', household: 6, under5: 3, age5to12: 2, elderly: 1, special: true, notes: 'Elderly care needed' },
      { phone: '+251955555555', email: 'employer5@example.com', name: 'Ato Dawit Solomon', zone: 'gulele', woreda: '09', household: 2, under5: 0, age5to12: 0, elderly: 0, special: false, notes: 'Need cook for international cuisine' }
    ];

    for (const e of employersData) {
      await query(
        `INSERT INTO employers (phone,email,password_hash,full_name,zone,woreda,household_size,children_under_5,children_5_to_12,elderly_members,has_special_needs,special_notes,registration_status,is_active,created_at) 
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'approved',true,NOW()-INTERVAL '30 days')`,
        [e.phone, e.email, passwordHash, e.name, e.zone, e.woreda, e.household, e.under5, e.age5to12, e.elderly, e.special, e.notes]
      );
    }
    console.log(`✅ ${employersData.length} employers\n`);

    // Fetch IDs for relationships
    const verifiedWorkers = await query("SELECT id FROM workers WHERE verification_status IN ('verified','approved') ORDER BY created_at LIMIT 5");
    const allEmployers = await query("SELECT id FROM employers ORDER BY created_at");
    const workerIds = verifiedWorkers.rows.map(r => r.id);
    const employerIds = allEmployers.rows.map(r => r.id);

    // ============================================
    // JOBS
    // ============================================
    console.log('💼 Inserting jobs...');
    const jobData = [
      ['maid','full_time','live_out',5000,7000,'morning','any','1','primary',['cooking_ethiopian']],
      ['nanny','part_time','live_in',7000,10000,'flexible','female','3','secondary',['childcare_infants']],
      ['driver','full_time','live_out',4000,6000,'afternoon','male','2','primary',['driving_license']],
      ['cook','full_time','live_out',6000,9000,'morning','any','3','certificate',['cooking_international']],
      ['cleaner','part_time','live_out',3000,5000,'flexible','female','0','none',['cleaning_deep']],
      ['guard','full_time','live_in',5000,7000,'night','male','2','primary',['first_aid']],
      ['maid','live_in','live_in',8000,12000,'flexible','female','5','secondary',['elderly_care']],
      ['nanny','live_out','live_out',6000,9000,'morning','any','2','secondary',['childcare_toddlers']]
    ];

    for (let i = 0; i < jobData.length; i++) {
      const j = jobData[i];
      await query(
        `INSERT INTO jobs (employer_id,worker_type,schedule,housing,salary_min,salary_max,working_hours,preferred_gender,min_experience,min_education,required_skills,is_urgent,status,created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'active',NOW()-($13||' days')::interval)`,
        [employerIds[i % employerIds.length],j[0],j[1],j[2],j[3],j[4],j[5],j[6],j[7],j[8],j[9],i%3===0,i*5]
      );
    }
    console.log('✅ 8 jobs\n');

    const jobs = await query("SELECT id, employer_id FROM jobs ORDER BY created_at");
    const jobIds = jobs.rows.map(r => r.id);

    // ============================================
    // APPLICATIONS
    // ============================================
    console.log('📋 Inserting applications...');
    const statuses = ['applied','shortlisted','interviewed','hired','applied','rejected','trial','applied','shortlisted','interviewed','applied','hired','applied','shortlisted','rejected'];

    for (let i = 0; i < statuses.length; i++) {
      const s = statuses[i];
      const history = [];
      if (s !== 'applied') history.push({status:'applied',at:new Date(Date.now()-20*864e5).toISOString()});
      if (['shortlisted','interviewed','hired','trial','rejected'].includes(s)) history.push({status:'shortlisted',at:new Date(Date.now()-15*864e5).toISOString()});
      if (['interviewed','hired','trial','rejected'].includes(s)) history.push({status:'interviewed',at:new Date(Date.now()-10*864e5).toISOString()});
      if (['hired','trial','rejected'].includes(s)) history.push({status:'trial',at:new Date(Date.now()-5*864e5).toISOString()});
      if (['hired','rejected'].includes(s)) history.push({status:s,at:new Date().toISOString()});

      await query(
        `INSERT INTO applications (job_id,worker_id,status,status_history,created_at) VALUES ($1,$2,$3,$4,NOW()-($5||' days')::interval)`,
        [jobIds[i%jobIds.length],workerIds[i%workerIds.length],s,JSON.stringify(history),i*3]
      );
    }
    console.log('✅ 15 applications\n');

    // ============================================
    // REVIEWS
    // ============================================
    console.log('⭐ Inserting reviews...');
    const hiredApps = await query("SELECT id, worker_id, job_id FROM applications WHERE status='hired' LIMIT 4");
    const ratings = [5,4,5,4,5,4,5,4,5,4];
    const comments = ['Excellent worker, very reliable','Great with kids','Very professional','Good but needs supervision','Outstanding performance','Reliable and trustworthy','Excellent cooking skills','Very respectful','Hard worker always on time','Good experience overall'];
    const tags = [['on_time','hard_worker','honest'],['good_with_children','respectful','clean'],['good_cooking','hard_worker','on_time']];

    for (let i = 0; i < 10; i++) {
      const app = hiredApps.rows[i % hiredApps.rows.length];
      const emp = await query("SELECT employer_id FROM jobs WHERE id=$1",[app.job_id]);
      await query(
        `INSERT INTO reviews (worker_id,employer_id,application_id,rating,context_tags,comment,created_at) VALUES ($1,$2,$3,$4,$5,$6,NOW()-($7||' days')::interval)`,
        [app.worker_id,emp.rows[0].employer_id,app.id,ratings[i],tags[i%3],comments[i],i*10]
      );
    }
    console.log('✅ 10 reviews\n');

    // ============================================
    // PAYMENTS
    // ============================================
    console.log('💰 Inserting payments...');
    const payTypes = ['registration','registration','registration','commission','urgent_hire','registration','commission','registration','registration','commission'];
    const payMethods = ['telebirr','bank_transfer','cash','telebirr','cash','bank_transfer','telebirr','cash','telebirr','bank_transfer'];

    for (let i = 0; i < 20; i++) {
      const isWorker = i % 2 === 0;
      const payerId = isWorker ? workerIds[i%workerIds.length] : employerIds[i%employerIds.length];
      const amount = i%10<5 ? 200 : i%10<8 ? 300 : i%10===8 ? 1500 : 200;
      await query(
        `INSERT INTO payments (payer_type,payer_id,payment_type,amount,currency,method,status,confirmed_at,created_at) VALUES ($1,$2,$3,$4,'ETB',$5,'confirmed',NOW()-($6||' days')::interval,NOW()-($6||' days')::interval)`,
        [isWorker?'worker':'employer',payerId,payTypes[i%10],amount,payMethods[i%10],i*5]
      );
    }
    console.log('✅ 20 payments\n');

    // ============================================
    // NOTIFICATIONS
    // ============================================
    console.log('🔔 Inserting notifications...');
    const nTypes = ['registration_approved','verification_approved','application_shortlisted','application_hired','payment_confirmed'];
    const nTitles = ['Registration approved','Verification complete','Shortlisted for job','You have been hired','Payment confirmed'];
    const nMsgs = ['Welcome to EthioDomestic!','Trust Score updated.','Employer interested!','Start your new job!','Thank you for payment.'];

    for (let i = 0; i < 15; i++) {
      await query(
        `INSERT INTO notifications (user_type,user_id,type,title,message,created_at) VALUES ('worker',$1,$2,$3,$4,NOW()-($5||' days')::interval)`,
        [workerIds[i%workerIds.length],nTypes[i%5],nTitles[i%5],nMsgs[i%5],i*2]
      );
    }
    console.log('✅ 15 notifications\n');

    // ============================================
    // VERIFICATION LOGS
    // ============================================
    console.log('📝 Inserting verification logs...');
    const cTypes = ['police_clearance','health_cert','id_document','reference_check','reference_check'];
    const cResults = ['passed','passed','passed','passed','failed'];
    const cNotes = ['Police clearance verified','Health cert valid','ID authentic','Positive feedback','Reference unreachable'];
    const adminRes = await query("SELECT id FROM admins WHERE email='admin@ethiodomestic.com' LIMIT 1");
    const adminId = adminRes.rows[0]?.id;

    for (let i = 0; i < 15; i++) {
      await query(
        `INSERT INTO verification_logs (worker_id,check_type,reference_contact_phone,result,notes,checked_by,checked_at) VALUES ($1,$2,$3,$4,$5,$6,NOW()-($7||' days')::interval)`,
        [workerIds[i%workerIds.length],cTypes[i%5],i%5>=3?'+2519'+String(800000000+i).padStart(9,'0'):null,cResults[i%5],cNotes[i%5],adminId,i*7]
      );
    }
    console.log('✅ 15 verification logs\n');

    // ============================================
    // SUMMARY
    // ============================================
    const summary = await query(`SELECT (SELECT COUNT(*) FROM workers) as tw,(SELECT COUNT(*) FROM workers WHERE verification_status IN ('verified','approved')) as vw,(SELECT COUNT(*) FROM employers) as te,(SELECT COUNT(*) FROM jobs WHERE status='active') as aj,(SELECT COUNT(*) FROM applications) as ta,(SELECT COUNT(*) FROM reviews) as tr,(SELECT COUNT(*) FROM payments WHERE status='confirmed') as tp`);
    const s = summary.rows[0];

    console.log('📊 Test Data Summary:');
    console.log(`   Workers: ${s.tw} (${s.vw} verified)`);
    console.log(`   Employers: ${s.te}`);
    console.log(`   Active Jobs: ${s.aj}`);
    console.log(`   Applications: ${s.ta}`);
    console.log(`   Reviews: ${s.tr}`);
    console.log(`   Payments: ${s.tp}`);
    console.log('\n✅ Test data seeded successfully!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seedTestData();