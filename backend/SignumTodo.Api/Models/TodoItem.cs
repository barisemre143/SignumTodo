namespace SignumTodo.Api.Models;

public sealed class TodoItem
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public string? Description { get; set; }
    public required string Assignee { get; set; }
    public DateOnly DueDate { get; set; }
    public TodoStatus Status { get; set; } = TodoStatus.Todo;
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAtUtc { get; set; }
}
