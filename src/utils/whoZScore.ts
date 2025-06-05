
// Standar WHO Z-Score untuk perhitungan stunting yang akurat
// Data ini didasarkan pada WHO Child Growth Standards 2006

interface WHOStandard {
  age: number; // dalam bulan
  gender: 'male' | 'female';
  heightMean: number; // rata-rata tinggi (cm)
  heightSD: number; // standar deviasi tinggi
  weightMean: number; // rata-rata berat (kg)
  weightSD: number; // standar deviasi berat
}

// Sampel data WHO standar untuk beberapa usia (data lengkap perlu tabel WHO resmi)
const WHO_HEIGHT_STANDARDS: WHOStandard[] = [
  // Usia 0-6 bulan
  { age: 0, gender: 'male', heightMean: 49.9, heightSD: 1.89, weightMean: 3.3, weightSD: 0.39 },
  { age: 0, gender: 'female', heightMean: 49.1, heightSD: 1.86, weightMean: 3.2, weightSD: 0.38 },
  { age: 6, gender: 'male', heightMean: 67.6, heightSD: 2.33, weightMean: 7.9, weightSD: 0.78 },
  { age: 6, gender: 'female', heightMean: 65.7, heightSD: 2.24, weightMean: 7.3, weightSD: 0.74 },
  
  // Usia 12-24 bulan
  { age: 12, gender: 'male', heightMean: 75.7, heightSD: 2.44, weightMean: 9.6, weightSD: 0.89 },
  { age: 12, gender: 'female', heightMean: 74.0, heightSD: 2.36, weightMean: 9.0, weightSD: 0.85 },
  { age: 24, gender: 'male', heightMean: 87.1, heightSD: 2.88, weightMean: 12.2, weightSD: 1.12 },
  { age: 24, gender: 'female', heightMean: 86.4, heightSD: 2.85, weightMean: 11.5, weightSD: 1.08 },
  
  // Usia 36-60 bulan
  { age: 36, gender: 'male', heightMean: 96.1, heightSD: 3.24, weightMean: 14.3, weightSD: 1.38 },
  { age: 36, gender: 'female', heightMean: 95.1, heightSD: 3.20, weightMean: 13.9, weightSD: 1.35 },
  { age: 48, gender: 'male', heightMean: 103.3, heightSD: 3.56, weightMean: 16.3, weightSD: 1.68 },
  { age: 48, gender: 'female', heightMean: 102.7, heightSD: 3.58, weightMean: 15.9, weightSD: 1.66 },
  { age: 60, gender: 'male', heightMean: 110.0, heightSD: 3.78, weightMean: 18.3, weightSD: 2.01 },
  { age: 60, gender: 'female', heightMean: 109.4, heightSD: 3.81, weightMean: 17.9, weightSD: 2.03 }
];

export const calculateAge = (birthDate: string): number => {
  if (!birthDate) return 0;
  const today = new Date();
  const birth = new Date(birthDate);
  const ageInMonths = (today.getFullYear() - birth.getFullYear()) * 12 + today.getMonth() - birth.getMonth();
  
  // Koreksi jika hari lahir belum terlewati di bulan ini
  if (today.getDate() < birth.getDate()) {
    return ageInMonths - 1;
  }
  
  return Math.max(0, ageInMonths);
};

const findNearestStandard = (age: number, gender: 'male' | 'female'): WHOStandard => {
  const standards = WHO_HEIGHT_STANDARDS.filter(s => s.gender === gender);
  
  // Cari standar terdekat berdasarkan usia
  let closest = standards[0];
  let minDiff = Math.abs(age - standards[0].age);
  
  for (const standard of standards) {
    const diff = Math.abs(age - standard.age);
    if (diff < minDiff) {
      minDiff = diff;
      closest = standard;
    }
  }
  
  return closest;
};

const interpolateStandard = (age: number, gender: 'male' | 'female'): WHOStandard => {
  const standards = WHO_HEIGHT_STANDARDS.filter(s => s.gender === gender).sort((a, b) => a.age - b.age);
  
  // Jika usia kurang dari minimum, gunakan standar terendah
  if (age <= standards[0].age) {
    return standards[0];
  }
  
  // Jika usia lebih dari maksimum, gunakan standar tertinggi
  if (age >= standards[standards.length - 1].age) {
    return standards[standards.length - 1];
  }
  
  // Cari dua standar untuk interpolasi
  let lower = standards[0];
  let upper = standards[1];
  
  for (let i = 0; i < standards.length - 1; i++) {
    if (age >= standards[i].age && age <= standards[i + 1].age) {
      lower = standards[i];
      upper = standards[i + 1];
      break;
    }
  }
  
  // Interpolasi linear
  const ratio = (age - lower.age) / (upper.age - lower.age);
  
  return {
    age,
    gender,
    heightMean: lower.heightMean + (upper.heightMean - lower.heightMean) * ratio,
    heightSD: lower.heightSD + (upper.heightSD - lower.heightSD) * ratio,
    weightMean: lower.weightMean + (upper.weightMean - lower.weightMean) * ratio,
    weightSD: lower.weightSD + (upper.weightSD - lower.weightSD) * ratio
  };
};

export interface ZScoreResult {
  heightForAge: number;
  weightForAge: number;
  weightForHeight: number;
  stuntingStatus: 'Normal' | 'Risiko Stunting' | 'Stunting' | 'Stunting Berat';
  underweightStatus: 'Normal' | 'Risiko Gizi Kurang' | 'Gizi Kurang' | 'Gizi Buruk';
  wastingStatus: 'Normal' | 'Risiko Kurus' | 'Kurus' | 'Kurus Berat';
  isStunted: boolean;
}

export const calculateWHOZScore = (
  height: number, 
  weight: number, 
  ageInMonths: number, 
  gender: 'male' | 'female'
): ZScoreResult => {
  const standard = interpolateStandard(ageInMonths, gender);
  
  // Hitung Z-Score berdasarkan WHO formula
  const heightForAge = (height - standard.heightMean) / standard.heightSD;
  const weightForAge = (weight - standard.weightMean) / standard.weightSD;
  
  // Untuk weight-for-height, kita perlu standar khusus (simplified)
  const expectedWeight = standard.weightMean * (height / standard.heightMean);
  const weightForHeight = (weight - expectedWeight) / standard.weightSD;
  
  // Klasifikasi stunting berdasarkan Height-for-Age Z-score
  let stuntingStatus: ZScoreResult['stuntingStatus'] = 'Normal';
  if (heightForAge < -3) {
    stuntingStatus = 'Stunting Berat';
  } else if (heightForAge < -2) {
    stuntingStatus = 'Stunting';
  } else if (heightForAge < -1) {
    stuntingStatus = 'Risiko Stunting';
  }
  
  // Klasifikasi underweight berdasarkan Weight-for-Age Z-score
  let underweightStatus: ZScoreResult['underweightStatus'] = 'Normal';
  if (weightForAge < -3) {
    underweightStatus = 'Gizi Buruk';
  } else if (weightForAge < -2) {
    underweightStatus = 'Gizi Kurang';
  } else if (weightForAge < -1) {
    underweightStatus = 'Risiko Gizi Kurang';
  }
  
  // Klasifikasi wasting berdasarkan Weight-for-Height Z-score
  let wastingStatus: ZScoreResult['wastingStatus'] = 'Normal';
  if (weightForHeight < -3) {
    wastingStatus = 'Kurus Berat';
  } else if (weightForHeight < -2) {
    wastingStatus = 'Kurus';
  } else if (weightForHeight < -1) {
    wastingStatus = 'Risiko Kurus';
  }
  
  return {
    heightForAge: Number(heightForAge.toFixed(2)),
    weightForAge: Number(weightForAge.toFixed(2)),
    weightForHeight: Number(weightForHeight.toFixed(2)),
    stuntingStatus,
    underweightStatus,
    wastingStatus,
    isStunted: heightForAge < -2
  };
};

export const getStuntingRecommendation = (result: ZScoreResult, ageInMonths: number): string[] => {
  const recommendations: string[] = [];
  
  if (result.isStunted) {
    recommendations.push('Segera rujuk ke fasilitas kesehatan untuk pemeriksaan lebih lanjut');
    recommendations.push('Berikan makanan bergizi tinggi dengan protein hewani');
    recommendations.push('Pastikan pemberian ASI eksklusif (jika usia < 6 bulan)');
    recommendations.push('Monitoring pertumbuhan setiap bulan');
  } else if (result.stuntingStatus === 'Risiko Stunting') {
    recommendations.push('Tingkatkan asupan gizi dengan makanan beragam');
    recommendations.push('Berikan makanan tambahan yang kaya protein');
    recommendations.push('Lakukan pemantauan pertumbuhan rutin');
  }
  
  if (ageInMonths < 6) {
    recommendations.push('Pastikan pemberian ASI eksklusif');
  } else if (ageInMonths < 24) {
    recommendations.push('Berikan MPASI yang beragam dan bergizi');
    recommendations.push('Lanjutkan pemberian ASI hingga 2 tahun');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('Pertahankan pola makan sehat dan bergizi seimbang');
    recommendations.push('Lakukan pemantauan pertumbuhan rutin setiap bulan');
  }
  
  return recommendations;
};
