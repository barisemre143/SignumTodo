using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Npgsql;
using SignumTodo.Application.Abstractions;
using SignumTodo.Infrastructure.Persistence;
using SignumTodo.Infrastructure.Repositories;

namespace SignumTodo.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        var dbPortValue = Environment.GetEnvironmentVariable("DB_PORT");
        var dbPort = int.TryParse(dbPortValue, out var parsedPort) ? parsedPort : 5432;

        var connectionString = new NpgsqlConnectionStringBuilder
        {
            Host = Environment.GetEnvironmentVariable("DB_HOST") ?? "localhost",
            Port = dbPort,
            Database = Environment.GetEnvironmentVariable("DB_NAME") ?? "signumtodo_db",
            Username = Environment.GetEnvironmentVariable("DB_USERNAME") ?? "postgres",
            Password = Environment.GetEnvironmentVariable("DB_PASSWORD") ?? string.Empty
        }.ConnectionString;

        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(connectionString));
        services.AddScoped<ITodoRepository, TodoRepository>();

        return services;
    }
}
