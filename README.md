# Modern Sudoku Oyunu

Modern tasarıma sahip, webpack ile paketlenmiş bir Sudoku oyunu. Oyun, SOLID prensiplerine uygun şekilde geliştirilmiş ve modern JavaScript özellikleri kullanılarak oluşturulmuştur.

![Sudoku Screenshot](screenshot.png)

## 🎮 Özellikler

- 🎯 Üç farklı zorluk seviyesi (Kolay, Orta, Zor)
- ⏱️ Süre takibi
- 🎯 Hata sayacı
- 🎨 Modern ve responsive tasarım
- 🌙 Otomatik çözüm özelliği
- 🎉 Animasyonlu geri bildirimler
- 📱 Mobil uyumlu tasarım
- ⌨️ Klavye desteği

## 🚀 Teknolojiler

- JavaScript (ES6+)
- Webpack 5
- CSS3
- HTML5
- Babel
- PostCSS
- ESLint

## 🛠️ Kurulum

1. Repoyu klonlayın:
   ```bash
   git clone https://github.com/osmcgrgenc/sudoku.git
   cd sudoku
   ```


2. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

3. Geliştirme sunucusunu başlatın:
   ```bash
   npm start
   ```

4. Tarayıcınızda açın:
   ```bash
   http://localhost:3080
   ```

## 📦 Production Build

Production build oluşturmak için:
```bash
npm run build
```

Build dosyaları `dist` klasöründe oluşturulacaktır.

## 🎮 Nasıl Oynanır

1. Zorluk seviyesi seçin
2. Boş hücrelere 1-9 arası sayıları yerleştirin
3. Her satır, sütun ve 3x3'lük kutuda 1'den 9'a kadar olan sayılar birer kez kullanılmalıdır
4. Yanlış sayı girişlerinde hücre kırmızı renkte gösterilir
5. Doğru sayı girişlerinde hücre yeşil renkte gösterilir
6. Bir sayı tüm pozisyonlara doğru yerleştirildiğinde o sayı butonu devre dışı kalır

### ⌨️ Klavye Kısayolları

- `1-9`: Sayı girişi
- `Delete/Backspace`: Hücreyi temizle
- `Arrow Keys`: Hücreler arası gezinme

## 🧪 Test

Testleri çalıştırmak için:
```bash
npm test
```


## 📁 Proje Yapısı

sudoku/
├── src/
│ ├── modules/
│ │ ├── Board.js
│ │ ├── GameState.js
│ │ ├── SudokuGenerator.js
│ │ ├── UIController.js
│ │ ├── EventEmitter.js
│ │ └── Timer.js
│ ├── styles/
│ │ └── main.css
│ ├── assets/
│ │ └── images/
│ ├── Game.js
│ ├── index.js
│ └── index.html
├── dist/
├── webpack.config.js
├── package.json
├── .babelrc
├── .eslintrc
├── postcss.config.js
└── README.md


## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakınız.

## 👥 Yazarlar

- Osman Çağrı GENÇ - [GitHub](https://github.com/osmcgrgenc)

## 🙏 Teşekkürler

- Font Awesome - ikonlar için
- Google Fonts - yazı tipleri için

## 📞 İletişim

Sorularınız için: osmcgrgenc@gmail.com

## 🐛 Bilinen Sorunlar

- [ ] Issue #1: Açıklama
- [ ] Issue #2: Açıklama

## 🗺️ Yol Haritası

- [ ] Dark mode desteği
- [ ] Çoklu dil desteği
- [ ] PWA desteği
- [ ] Oyun kaydetme özelliği