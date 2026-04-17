/**
 * ARTEGON ERP v2 — Firebase Seed Script
 * Çalıştır: node seed.mjs
 * Admin kullanıcısı + temel Firestore koleksiyonlarını oluşturur.
 */

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            'AIzaSyBL7ZNXzA998M8EaWkajDEIja62-473XW0',
  authDomain:        'global-27073.firebaseapp.com',
  projectId:         'global-27073',
  storageBucket:     'global-27073.firebasestorage.app',
  messagingSenderId: '121599455300',
  appId:             '1:121599455300:web:00fdd6fe31b5baa8e78c11',
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

// ─── Create Admin User ────────────────────────────────────────────────────────
async function createAdminUser() {
  const email    = 'admin@artegon.com.tr';
  const password = 'Admin1234!';
  const name     = 'Sistem Admin';

  console.log('\n[1] Admin kullanıcısı oluşturuluyor...');
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });

    await setDoc(doc(db, 'users', cred.user.uid), {
      uid:        cred.user.uid,
      email,
      displayName: name,
      role:       'ADMIN',
      department: 'YÖNETİM',
      isActive:   true,
      createdAt:  serverTimestamp(),
      updatedAt:  serverTimestamp(),
    });

    console.log(`   ✅ Kullanıcı oluşturuldu: ${email} (uid: ${cred.user.uid})`);
    return cred.user;
  } catch (err) {
    if (err.code === 'auth/email-already-in-use') {
      console.log('   ℹ️  Admin kullanıcısı zaten mevcut, atlanıyor.');
    } else {
      throw err;
    }
  }
}

// ─── Seed Firestore Collections ───────────────────────────────────────────────
async function seedFirestore() {
  console.log('\n[2] Firestore koleksiyonları oluşturuluyor...');

  // Müşteriler
  const customers = [
    { id: 'MST-001', code: 'MST-001', name: 'Savunma Bakanlığı', type: 'KAMU', country: 'TR', contactName: 'Ahmet Kaya', contactEmail: 'ahmet.kaya@msb.gov.tr', contactPhone: '+90 312 000 0001', isActive: true, createdAt: serverTimestamp() },
    { id: 'MST-002', code: 'MST-002', name: 'ASELSAN A.Ş.',       type: 'ÖZEL', country: 'TR', contactName: 'Mehmet Yıldız', contactEmail: 'mehmet@aselsan.com.tr', contactPhone: '+90 312 000 0002', isActive: true, createdAt: serverTimestamp() },
    { id: 'MST-003', code: 'MST-003', name: 'ROKETSAN A.Ş.',      type: 'ÖZEL', country: 'TR', contactName: 'Ayşe Demir',    contactEmail: 'ayse@roketsan.com.tr', contactPhone: '+90 312 000 0003', isActive: true, createdAt: serverTimestamp() },
  ];

  // Tedarikçiler
  const suppliers = [
    { id: 'TDR-001', code: 'TDR-001', name: 'Çelik Endüstri A.Ş.',   category: 'HAMMADDE',   country: 'TR', contactName: 'Can Öztürk',  contactEmail: 'can@celik.com.tr',   paymentTerms: 30, leadTimeDays: 7,  rating: 4, isActive: true, createdAt: serverTimestamp() },
    { id: 'TDR-002', code: 'TDR-002', name: 'Elektronik Bileşen Ltd.',category: 'ELEKTRONİK', country: 'TR', contactName: 'Ali Arslan',   contactEmail: 'ali@ebiles.com.tr',  paymentTerms: 45, leadTimeDays: 14, rating: 5, isActive: true, createdAt: serverTimestamp() },
    { id: 'TDR-003', code: 'TDR-003', name: 'Optik Sistemler A.Ş.',   category: 'OPTİK',      country: 'TR', contactName: 'Selin Çetin',  contactEmail: 'selin@optik.com.tr', paymentTerms: 60, leadTimeDays: 21, rating: 4, isActive: true, createdAt: serverTimestamp() },
  ];

  // Parçalar (BOM)
  const parts = [
    { id: 'PRÇ-0001', partNo: 'PRÇ-0001', name: 'Gövde Sacı',         type: 'HAMMADDE',     unit: 'ADET', unitCost: 450,   minStock: 50,  currentStock: 120, category: 'YAPI', isActive: true, createdAt: serverTimestamp() },
    { id: 'PRÇ-0002', partNo: 'PRÇ-0002', name: 'Tetik Grubu',         type: 'SATIN_ALINAN', unit: 'ADET', unitCost: 850,   minStock: 20,  currentStock: 35,  category: 'MEKANIK', isActive: true, createdAt: serverTimestamp() },
    { id: 'PRÇ-0003', partNo: 'PRÇ-0003', name: 'Optik Kızak',         type: 'SATIN_ALINAN', unit: 'ADET', unitCost: 1200,  minStock: 10,  currentStock: 8,   category: 'OPTİK', isActive: true, createdAt: serverTimestamp() },
    { id: 'PRÇ-0004', partNo: 'PRÇ-0004', name: 'Elektronik Kart',     type: 'SATIN_ALINAN', unit: 'ADET', unitCost: 3500,  minStock: 15,  currentStock: 22,  category: 'ELEKTRONİK', isActive: true, createdAt: serverTimestamp() },
    { id: 'PRÇ-0005', partNo: 'PRÇ-0005', name: 'Kasa Montaj Parçası', type: 'İMALAT',       unit: 'ADET', unitCost: 320,   minStock: 30,  currentStock: 65,  category: 'YAPI', isActive: true, createdAt: serverTimestamp() },
    { id: 'PRÇ-0006', partNo: 'PRÇ-0006', name: 'Namlu Çeliği',        type: 'HAMMADDE',     unit: 'METRE',unitCost: 780,   minStock: 100, currentStock: 42,  category: 'HAMMADDE', isActive: true, createdAt: serverTimestamp() },
    { id: 'PRÇ-0007', partNo: 'PRÇ-0007', name: 'Yay Seti',            type: 'SATIN_ALINAN', unit: 'SET',  unitCost: 125,   minStock: 50,  currentStock: 78,  category: 'MEKANIK', isActive: true, createdAt: serverTimestamp() },
  ];

  // İş Merkezleri
  const workCenters = [
    { id: 'MRK-001', code: 'MRK-001', name: 'CNC Tezgah Hattı',   type: 'MAKİNE',    capacity: 8, unit: 'ADET/SAAT', costPerHour: 450, isActive: true, status: 'MÜSAİT', createdAt: serverTimestamp() },
    { id: 'MRK-002', code: 'MRK-002', name: 'Montaj İstasyonu 1', type: 'MONTAJ',     capacity: 4, unit: 'ADET/SAAT', costPerHour: 280, isActive: true, status: 'MÜSAİT', createdAt: serverTimestamp() },
    { id: 'MRK-003', code: 'MRK-003', name: 'QC Test Bankası',    type: 'TEST',       capacity: 2, unit: 'ADET/SAAT', costPerHour: 350, isActive: true, status: 'MÜSAİT', createdAt: serverTimestamp() },
    { id: 'MRK-004', code: 'MRK-004', name: 'Atış Poligonu',      type: 'TEST_ATEŞ',  capacity: 1, unit: 'ADET/GÜN',  costPerHour: 800, isActive: true, status: 'MÜSAİT', createdAt: serverTimestamp() },
    { id: 'MRK-005', code: 'MRK-005', name: 'Yüzey İşleme',       type: 'MAKİNE',    capacity: 6, unit: 'ADET/SAAT', costPerHour: 380, isActive: true, status: 'MÜSAİT', createdAt: serverTimestamp() },
  ];

  // Ürün Modelleri
  const models = [
    { id: 'MDL-001', code: 'MDL-001', name: 'ARG-9 Piyade Tüfeği',   version: 'R3', bom: ['PRÇ-0001','PRÇ-0002','PRÇ-0004','PRÇ-0005','PRÇ-0006','PRÇ-0007'], unitPrice: 45000, leadTimeDays: 30, isActive: true, createdAt: serverTimestamp() },
    { id: 'MDL-002', code: 'MDL-002', name: 'ARG-15 Sniper Sistemi', version: 'R2', bom: ['PRÇ-0001','PRÇ-0002','PRÇ-0003','PRÇ-0004','PRÇ-0006'],           unitPrice: 120000, leadTimeDays: 45, isActive: true, createdAt: serverTimestamp() },
  ];

  // Seed each collection
  const collections = [
    { col: 'customers',   data: customers },
    { col: 'suppliers',   data: suppliers },
    { col: 'parts',       data: parts },
    { col: 'workCenters', data: workCenters },
    { col: 'models',      data: models },
  ];

  for (const { col, data } of collections) {
    // Check if collection already has data
    const snap = await getDocs(collection(db, col));
    if (!snap.empty) {
      console.log(`   ℹ️  '${col}' koleksiyonu zaten dolu (${snap.size} kayıt), atlanıyor.`);
      continue;
    }
    for (const item of data) {
      const { id, ...rest } = item;
      await setDoc(doc(db, col, id), rest);
    }
    console.log(`   ✅ '${col}' — ${data.length} kayıt eklendi.`);
  }
}

// ─── Run ──────────────────────────────────────────────────────────────────────
(async () => {
  console.log('════════════════════════════════════════════');
  console.log('  ARTEGON ERP v2 — Firebase Seed Script');
  console.log('════════════════════════════════════════════');

  try {
    await createAdminUser();
    await seedFirestore();
    console.log('\n✅ Seed tamamlandı!');
    console.log('\n📧 Giriş bilgileri:');
    console.log('   E-posta : admin@artegon.com.tr');
    console.log('   Şifre   : Admin1234!');
    console.log('   URL     : http://localhost:5174\n');
  } catch (err) {
    console.error('\n❌ Seed hatası:', err.code || err.message);
  } finally {
    process.exit(0);
  }
})();
