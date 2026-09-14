using SignumTodo.Domain.Enums;

namespace SignumTodo.Application.Todos.Requests;

public sealed record PatchTodoRequest(
    string? TaskDescription,
    string? AssignedTo,
    DateOnly? PlannedDate,
    TodoItemStatus? Status);
