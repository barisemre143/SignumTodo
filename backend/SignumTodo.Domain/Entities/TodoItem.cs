using SignumTodo.Domain.Enums;
using SignumTodo.Domain.Exceptions;

namespace SignumTodo.Domain.Entities;

public class TodoItem
{
    public int Id { get; set; }

    public string TaskDescription { get; set; } = string.Empty;

    public string AssignedTo { get; set; } = string.Empty;

    public DateTime PlannedDate { get; set; }

    public TodoItemStatus Status { get; private set; } = TodoItemStatus.Todo;

    public bool IsCompleted => Status == TodoItemStatus.Completed;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    public void ChangeStatus(TodoItemStatus newStatus)
    {
        if (Status == TodoItemStatus.Todo && newStatus == TodoItemStatus.Completed)
        {
            throw new DomainException("A task cannot move directly from todo to completed.");
        }

        Status = newStatus;
        UpdatedAt = DateTime.UtcNow;
    }
}
