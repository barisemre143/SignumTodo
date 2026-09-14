using SignumTodo.Domain.Enums;
using SignumTodo.Domain.Exceptions;

namespace SignumTodo.Domain.Entities;

public class TodoItem
{
    public int Id { get; set; }

    public string TaskDescription { get; set; } = string.Empty;

    public string AssignedTo { get; set; } = string.Empty;

    public DateOnly PlannedDate { get; set; }

    public TodoItemStatus Status { get; private set; } = TodoItemStatus.Todo;

    public bool IsCompleted => Status == TodoItemStatus.Completed;

    public bool IsOverdue =>
        Status != TodoItemStatus.Completed &&
        PlannedDate < DateOnly.FromDateTime(DateTime.UtcNow);

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    public void UpdateDetails(string taskDescription, string assignedTo, DateOnly plannedDate)
    {
        TaskDescription = taskDescription;
        AssignedTo = assignedTo;
        PlannedDate = plannedDate;
        UpdatedAt = DateTime.UtcNow;
    }

    public void ChangeStatus(TodoItemStatus newStatus)
    {
        if (Status == newStatus)
        {
            return;
        }

        var isValidTransition =
            Status == TodoItemStatus.Todo && newStatus == TodoItemStatus.InProgress ||
            Status == TodoItemStatus.InProgress && newStatus == TodoItemStatus.Completed;

        if (!isValidTransition)
        {
            throw new DomainException($"Task status cannot change from {Status} to {newStatus}.");
        }

        Status = newStatus;
        UpdatedAt = DateTime.UtcNow;
    }
}
