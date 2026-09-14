namespace SignumTodo.Application.Todos.Requests;

public sealed record UpdateTodoRequest(
    string TaskDescription,
    string AssignedTo,
    DateOnly PlannedDate);
