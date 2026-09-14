using SignumTodo.Application.Todos.Dtos;
using SignumTodo.Application.Todos.Requests;
using SignumTodo.Domain.Enums;

namespace SignumTodo.Application.Todos;

public interface ITodoService
{
    Task<IReadOnlyList<TodoItemDto>> GetAllAsync(TodoItemStatus? status, string? assignedTo, DateOnly? plannedDate, CancellationToken cancellationToken);

    Task<TodoItemDto?> GetByIdAsync(int id, CancellationToken cancellationToken);

    Task<TodoItemDto> CreateAsync(CreateTodoRequest request, CancellationToken cancellationToken);

    Task<TodoItemDto?> UpdateAsync(int id, UpdateTodoRequest request, CancellationToken cancellationToken);

    Task<TodoItemDto?> PatchAsync(int id, PatchTodoRequest request, CancellationToken cancellationToken);

    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken);
}
