using SignumTodo.Application.Abstractions;
using SignumTodo.Application.Common;
using SignumTodo.Application.Todos.Dtos;
using SignumTodo.Application.Todos.Requests;
using SignumTodo.Domain.Entities;
using SignumTodo.Domain.Enums;

namespace SignumTodo.Application.Todos;

public sealed class TodoService : ITodoService
{
    private readonly ITodoRepository _todoRepository;

    public TodoService(ITodoRepository todoRepository)
    {
        _todoRepository = todoRepository;
    }

    public async Task<IReadOnlyList<TodoItemDto>> GetAllAsync(TodoItemStatus? status, string? assignedTo, DateOnly? plannedDate, CancellationToken cancellationToken)
    {
        var todoItems = await _todoRepository.GetAllAsync(status, assignedTo, plannedDate, cancellationToken);

        return todoItems.Select(MapToDto).ToArray();
    }

    public async Task<TodoItemDto?> GetByIdAsync(int id, CancellationToken cancellationToken)
    {
        var todoItem = await _todoRepository.GetByIdAsync(id, cancellationToken);

        return todoItem is null ? null : MapToDto(todoItem);
    }

    public async Task<TodoItemDto> CreateAsync(CreateTodoRequest request, CancellationToken cancellationToken)
    {
        ValidateDetails(request.TaskDescription, request.AssignedTo, request.PlannedDate);

        var todoItem = new TodoItem
        {
            TaskDescription = request.TaskDescription,
            AssignedTo = request.AssignedTo,
            PlannedDate = request.PlannedDate
        };

        await _todoRepository.AddAsync(todoItem, cancellationToken);
        await _todoRepository.SaveChangesAsync(cancellationToken);

        return MapToDto(todoItem);
    }

    public async Task<TodoItemDto?> UpdateAsync(int id, UpdateTodoRequest request, CancellationToken cancellationToken)
    {
        var todoItem = await _todoRepository.GetByIdAsync(id, cancellationToken);
        if (todoItem is null)
        {
            return null;
        }

        ValidateDetails(request.TaskDescription, request.AssignedTo, request.PlannedDate);

        todoItem.UpdateDetails(request.TaskDescription, request.AssignedTo, request.PlannedDate);

        await _todoRepository.SaveChangesAsync(cancellationToken);

        return MapToDto(todoItem);
    }

    public async Task<TodoItemDto?> PatchAsync(int id, PatchTodoRequest request, CancellationToken cancellationToken)
    {
        var todoItem = await _todoRepository.GetByIdAsync(id, cancellationToken);
        if (todoItem is null)
        {
            return null;
        }

        var taskDescription = request.TaskDescription ?? todoItem.TaskDescription;
        var assignedTo = request.AssignedTo ?? todoItem.AssignedTo;
        var plannedDate = request.PlannedDate ?? todoItem.PlannedDate;

        if (request.TaskDescription is not null ||
            request.AssignedTo is not null ||
            request.PlannedDate is not null)
        {
            ValidateDetails(taskDescription, assignedTo, plannedDate);
            todoItem.UpdateDetails(taskDescription, assignedTo, plannedDate);
        }

        if (request.Status is not null)
        {
            todoItem.ChangeStatus(request.Status.Value);
        }

        await _todoRepository.SaveChangesAsync(cancellationToken);

        return MapToDto(todoItem);
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken)
    {
        var todoItem = await _todoRepository.GetByIdAsync(id, cancellationToken);
        if (todoItem is null)
        {
            return false;
        }

        _todoRepository.Remove(todoItem);
        await _todoRepository.SaveChangesAsync(cancellationToken);

        return true;
    }

    private static TodoItemDto MapToDto(TodoItem todoItem)
    {
        return new TodoItemDto(
            todoItem.Id,
            todoItem.TaskDescription,
            todoItem.AssignedTo,
            todoItem.PlannedDate,
            todoItem.Status,
            todoItem.IsCompleted,
            todoItem.CreatedAt,
            todoItem.UpdatedAt);
    }

    private static void ValidateDetails(string taskDescription, string assignedTo, DateOnly plannedDate)
    {
        if (string.IsNullOrWhiteSpace(taskDescription))
        {
            throw new ValidationException("Task description is required.");
        }

        if (string.IsNullOrWhiteSpace(assignedTo))
        {
            throw new ValidationException("Assigned person is required.");
        }

        if (plannedDate == default)
        {
            throw new ValidationException("Planned date is required.");
        }

        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        if (plannedDate < today)
        {
            throw new ValidationException("Planned date cannot be in the past.");
        }
    }
}
