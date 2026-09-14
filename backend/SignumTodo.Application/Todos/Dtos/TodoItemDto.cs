using SignumTodo.Domain.Enums;

namespace SignumTodo.Application.Todos.Dtos;

public sealed record TodoItemDto(
    int Id,
    string TaskDescription,
    string AssignedTo,
    DateOnly PlannedDate,
    TodoItemStatus Status,
    bool IsCompleted,
    DateTime CreatedAt,
    DateTime? UpdatedAt);
