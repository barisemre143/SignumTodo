using Microsoft.EntityFrameworkCore;
using SignumTodo.Api.Data;
using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Configuration.AddJsonFile("appsettings.Local.json", optional: true, reloadOnChange: true);

var connectionString = builder.Configuration.GetConnectionString("Postgres");
if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException(
        "PostgreSQL bağlantısı bulunamadı. SETUP.md içindeki user-secrets komutunu çalıştırın.");
}

builder.Services.AddDbContext<TodoDbContext>(options =>
    options.UseNpgsql(connectionString));
builder.Services.AddControllers().AddJsonOptions(options =>
    options.JsonSerializerOptions.Converters.Add(
        new JsonStringEnumConverter(JsonNamingPolicy.CamelCase)));
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod());
});

var app = builder.Build();

await using (var scope = app.Services.CreateAsyncScope())
{
    var db = scope.ServiceProvider.GetRequiredService<TodoDbContext>();
    await db.Database.EnsureCreatedAsync();
    await db.Database.ExecuteSqlRawAsync("""
        ALTER TABLE todos
            ADD COLUMN IF NOT EXISTS assignee character varying(100) NOT NULL DEFAULT 'Atanmamış',
            ADD COLUMN IF NOT EXISTS due_date date NOT NULL DEFAULT (CURRENT_DATE + 7),
            ADD COLUMN IF NOT EXISTS status character varying(20) NOT NULL DEFAULT 'todo';

        DO $$
        BEGIN
            IF EXISTS (
                SELECT 1
                FROM information_schema.columns
                WHERE table_schema = 'public'
                  AND table_name = 'todos'
                  AND column_name = 'is_completed'
            ) THEN
                UPDATE todos SET status = 'completed' WHERE is_completed = TRUE;
                ALTER TABLE todos DROP COLUMN is_completed;
            END IF;
        END $$;

        CREATE INDEX IF NOT EXISTS ix_todos_status ON todos (status);
        CREATE INDEX IF NOT EXISTS ix_todos_assignee ON todos (assignee);
        CREATE INDEX IF NOT EXISTS ix_todos_due_date ON todos (due_date);
        """);
}

app.UseCors("Frontend");
app.UseAuthorization();
app.MapControllers();

app.Run();
