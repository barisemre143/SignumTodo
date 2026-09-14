namespace SignumTodo.Application.Todos.Requests;

public sealed record CreateTodoRequest(
    string TaskDescription,
    string AssignedTo,
    DateOnly PlannedDate);
