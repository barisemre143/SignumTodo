using Microsoft.Extensions.DependencyInjection;
using SignumTodo.Application.Todos;

namespace SignumTodo.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<ITodoService, TodoService>();

        return services;
    }
}
