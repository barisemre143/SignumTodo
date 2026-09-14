using System.ComponentModel.DataAnnotations;
using SignumTodo.Api.Models;

namespace SignumTodo.Api.Contracts;

public sealed class UpdateTodoRequest
{
    [Required, StringLength(200, MinimumLength = 1)]
    public required string Title { get; init; }

    [StringLength(1000)]
    public string? Description { get; init; }

    [Required, StringLength(100, MinimumLength = 1)]
    public required string Assignee { get; init; }

    public DateOnly DueDate { get; init; }

    public TodoStatus Status { get; init; }
}
