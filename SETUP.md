# Signum Todo kurulum ve çalıştırma

Uygulama React/Vite arayüzü, .NET 10 Web API ve PostgreSQL kullanır.

İki ana ekran bulunur:

1. Kanban görev panosu: `Todo → In Progress → Completed`
2. Kişi bazlı iş yükü ve geciken görevler

Görev kartlarında görev tanımı, açıklama, atanan kişi ve son tarih tutulur. Kartlar sürüklenerek veya kart üzerindeki düğmelerle aşamalar arasında taşınır. `Todo` aşamasından doğrudan `Completed` aşamasına geçiş hem arayüzde hem API'de engellenir.

## Veritabanı bağlantısı

PostgreSQL kurulumu sırasında belirlediğiniz `postgres` parolasıyla bağlantıyı .NET user-secrets içine kaydedin. `PAROLANIZ` bölümünü kendi parolanızla değiştirin:

```powershell
cd backend\SignumTodo.Api
dotnet user-secrets set "ConnectionStrings:Postgres" "Host=localhost;Port=5432;Database=signum_todo;Username=postgres;Password=PAROLANIZ"
```

Bu bilgisayarda bağlantı bilgisi ayrıca Git tarafından yok sayılan `appsettings.Local.json` dosyasına ayarlanmıştır; parola repoya veya commit'e girmez.

API ilk çalıştığında `signum_todo` veritabanını ve `todos` tablosunu oluşturur.

### Bu bilgisayarda PostgreSQL'i başlatma

Windows yükleyicisi Türkçe locale adındaki karakterler nedeniyle servisi oluşturamadığı için yerel küme çalışma klasöründe hazırlandı. Bilgisayar yeniden başlatıldıktan sonra ayrı bir terminalde şu komutu çalıştırın:

```powershell
& 'C:\Program Files\PostgreSQL\18\bin\postgres.exe' -D 'C:\Users\Lenovo\Documents\Codex\2026-09-14\ger\work\postgres-data' -p 5432
```

Alternatif olarak PostgreSQL'i yeniden kurarken locale olarak `C` seçerek normal Windows servisi oluşturabilirsiniz.

## Çalıştırma

İki ayrı terminal açın.

Backend:

```powershell
cd backend\SignumTodo.Api
dotnet restore
dotnet run --launch-profile http
```

Frontend:

```powershell
cd frontend
npm install
npm run dev
```

Tarayıcıdan `http://localhost:5173` adresini açın. Vite, `/api` isteklerini `http://localhost:5213` adresindeki backend'e yönlendirir.

## API uçları

| Metot | Adres | İşlem |
| --- | --- | --- |
| `GET` | `/api/todos` | Todo listesini getirir |
| `GET` | `/api/todos/{id}` | Tek bir todo getirir |
| `POST` | `/api/todos` | Yeni todo oluşturur |
| `PUT` | `/api/todos/{id}` | Todo günceller |
| `DELETE` | `/api/todos/{id}` | Todo siler |
