using SignumTodo.Domain.Entities;
using SignumTodo.Domain.Enums;

namespace SignumTodo.Application.Abstractions;

public interface ITodoRepository
{
    Task<IReadOnlyList<TodoItem>> GetAllAsync(TodoItemStatus? status, string? assignedTo, DateOnly? plannedDate, CancellationToken cancellationToken);

    Task<TodoItem?> GetByIdAsync(int id, CancellationToken cancellationToken);

    Task AddAsync(TodoItem todoItem, CancellationToken cancellationToken);

    void Remove(TodoItem todoItem);

    Task SaveChangesAsync(CancellationToken cancellationToken);
}
