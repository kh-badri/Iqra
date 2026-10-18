export interface QiblaLocation {
  name: string;
  lat: number;
  lng: number;
}

export interface CompassData {
  heading: number; // 0..360 derajat arah hadap HP dari Utara
  qiblaBearing: number; // 0..360 derajat arah Kiblat dari Utara
  relativeAngle: number; // -180..180 derajat perbedaan hadap HP ke arah Kiblat
  isAligned: boolean; // True jika menghadap Kiblat dalam toleransi ±3 derajat
  accuracy: number | null; // Akurasi sensor (derajat kesalahan)
  hasSensor: boolean; // Apakah perangkat memiliki sensor kompas fisik
  isPermissionGranted: boolean; // Izin orientasi sensor (khusus iOS 13+)
  pitch: number; // Kemiringan depan/belakang (beta: -180..180)
  roll: number; // Kemiringan kiri/kanan (gamma: -90..90)
  isFlat: boolean; // Apakah HP berada pada posisi mendatar (rekomendasi kompas)
  isSimulated: boolean; // Apakah sedang dalam mode simulasi (desktop)
}
