---
  title: "Mata Kuliah yang Saya Sesali Tidak Saya Pelajari dengan Serius"
  publishedDate: "2025-10-29"
  categories: ["Belajar", "Santai"]
  cover: "cover.avif"
---

Saya adalah lulusan S1 Matematika di Universitas Negeri Malang, selama kuliah saya telah menempuh 146 SKS, jumlah yang cukup untuk bisa dinyatakan lulus dari kampus ini. Namun meskipun begitu, saya akui tidak hebat di semua mata kuliah, bahkan bisa dibilang, jika dibandingkan dengan teman-teman saya yang lain saya termasuk mahasiswa dengan nilai pas-pasan. Faktornya tentu saja banyak, seperti keaktifan di organisasi, faktor dosen, dan terutama kemalasan diri saya sendiri.

Lalu belakangan ini, di sela masa senggang saya berkeinginan untuk belajar tentang machine learning, memang, selama kuliah pun saya telah menerapkannya, bahkan skripsi saya pun terkait dengan deep learning. Namun, saat itu saya hanya menerapkannya secara “buta” tanpa tahu konsep-konsep di dalamnya.

Keinginan saya tersebut membawa saya untuk mempelajari matematika untuk machine learning. Tentunya, banyak konsep selama kuliah yang saya ulang untuk pelajari, namun sialnya banyak diantaranya yang saya banyak abaikan selama kuliah, alhasil saya seperti mmempelajari dari nol.

Oleh karena itu, saya akan membagikan beberapa topik kuliah yang saya sesali tidak saya pelajari dengan serius selama masa kuliah sebagai berikut:

## 1. Pengantar Statistika Matematis (_Introduction to Mathematical Statistic_)

Bicara soal _machine learning_, tentu tidak akan lepas dari yang namanya statistika, banyak sekali metode _metode machine_ learning klasik yang menggunakan statistika sebagai dasar keilmuannya, mulai dari linear regression, logistic regression, bayesian, hingga gaussian processes. Selain itu parameter-parameter serta tools-tools preprocessing data untuk model seperti: Principal Component Analysis (PCA); serta validation seperti MSE dan RMSE; juga mengandalkan statistika sebagai dasar ilmunya.

Mata kuliah ini memang tidak secara spesifik membahas hal-hal di atas, namun pondasi dasar yang dibahas di mata kuliah ini sangat penting untuk bisa memahami kesemua hal yang telah saya sebutkan. Misalnya saja model distribusi data, biasanya model-model machine learning akan bergantung pada tipe distribusi data yang sesuai seperti gaussian distribution atau sering disebut distribusi normal.

$$
p(x)=\frac{1}{\sqrt{ 2\pi \sigma^2 }}\exp \left( - \frac{(x-\mu)^2}{2\sigma^2} \right) \\ \text{Probability density function (pdf) dari distribusi normal}
$$

Distribusi normal menjadi dasar penting untuk menyimpulkan informasi dari sampel data. Distribusi ini sangat penting karena banyak metode statistik dan machine learning mengasumsikan data mengikuti distribusi normal, misalnya saja pada model-model berbasis gaussian processes. Lebih dalamnya lagi, kita perlu mengetahui bagaimana cara-cara mean, varians, kovarians, hingga dependensi data yang kesemuanya dibahas di mata kuliah ini.

Pada akhirnya, mata kuliah ini memberikan pelajaran yang sangat berharga bagi siapapun yang ingin mendalami machine learning maupun data analyst.

## 2. Aljabar Linear (_Linear Algebra_) dan Turunannya

Aljabar linear adalah salah satu cabang matematika yang membahas matriks dan vektor secara mendalam, sedangkan matriks dan vektor itu sendiri merupakan bagian paling fundamental dalam komputasi modern, terutama dalam machine learning dan deep learning. Hampir semua operasi dalam neural networks, mulai dari forward propagation hingga backpropagation, melibatkan operasi matriks dan vektor yang merupakan inti dari aljabar linear.

Mata kuliah-mata kuliah yang membahas aljabar linear diantaranya adalah Aljabar Linear Elementer, Geometri Analitik, hingga Teori Grup, dari sinilah konsep-konsep seperti transformasi linear, eigenvalue dan eigenvector, dekomposisi matriks (seperti SVD dan eigendecomposition), serta operasi-operasi matriks lainnya dibahas.

Konsep-konsep tersebut sangat krusial untuk memahami bagaimana model machine learning bekerja di balik layar. Misalnya, dalam Principal Component Analysis (PCA) yang saya sebutkan sebelumnya, kita menggunakan eigendecomposition untuk menemukan komponen utama dari data.

> [!NOTE] Eigenvalues & Eigenvectors
> Bayangkan matriks $A$ sebagai mesin transformasi (rotasi, skala, geser, dll).
> Biasanya, ketika kita masukkan sebuah vektor $x$, arah vektor itu akan berubah.
> **Namun**: ada beberapa arah spesial yang **tidak berubah arah**, hanya panjangnya yang berubah.
>
> - **Eigenvector** → arah yang tetap
> - **Eigenvalue** → faktor perubahan panjangnya

Contoh di atas adalah konsep eigenvalues dan eigenvektor yang akan sangat sering dipakai dalam dunia machine learning, ini membuktikan bahwa mata kuliah-mata kuliah ini sangat penting untuk dipelajari dengan serius.

## 3. Analisis Numerik (_Numerical Analysis_)

Analisis numerik adalah cabang matematika yang mempelajari metode-metode untuk menyelesaikan masalah matematika secara numerik menggunakan komputer. Dalam machine learning, hampir semua algoritma optimasi seperti gradient descent, Newton's method, dan conjugate gradient berasal dari konsep-konsep yang dipelajari di mata kuliah ini. Lebih jauh lagi, metode-metode untuk menyelesaikan sistem persamaan linear, interpolasi, dan aproksimasi fungsi yang merupakan inti dari analisis numerik sangat sering digunakan dalam implementasi model-model machine learning.

Salah satu contoh nyata adalah dalam proses training neural networks, dimana kita perlu menghitung gradien dan melakukan update parameter menggunakan metode optimasi numerik. Memahami bagaimana metode-metode ini bekerja, termasuk masalah seperti numerical stability dan convergence, sangat penting untuk bisa melakukan debugging dan optimasi model dengan efektif.

Lucunya adalah, saya belakangan mempelajari metode-metode optimasi seperti Newton-Raphson method, hingga gradient descent secara “buta”. Lalu suatu ketika, saya membuka ulang dokumen-dokumen selama kuliah termasuk mata kuliah ini, alangkah terkejutnya saya saat melihat bahwa konsep-konsep tersebut ternyata sudah dipelajari di perkuliahan. Seketika saya malu pada diri saya sendiri, lebih-lebih jika mengingat betapa nyamannya dosen pengampu saat itu menjelaskan.

---

Demikian itu adalah beberapa mata kuliah yang saya sesali tidak mempelajarinya dengan serius. Artikel ini dibuat sebagai rujukan kepada mahasiswa program studi Matematika yang ingin mendalami dunia AI. Akhirnya, teruntuk siapapun yang membaca tulisan ini, saya berharap bahwa kalian tidak mengulangi kesalahan tersebut
