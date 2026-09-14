using Microsoft.EntityFrameworkCore;
using SignumTodo.Application.Abstractions;
using SignumTodo.Domain.Entities;
using SignumTodo.Domain.Enums;
using SignumTodo.Infrastructure.Persistence;

namespace SignumTodo.Infrastructure.Repositories;

public sealed class TodoRepository : ITodoRepository
{
    private readonly AppDbContext _dbContext;

    public TodoRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<TodoItem>> GetAllAsync(TodoItemStatus? status, string? assignedTo, DateOnly? plannedDate, CancellationToken cancellationToken)
    {
        var query = _dbContext.TodoItems.AsQueryable();

        if (status is not null)
        {
            query = query.Where(todo => todo.Status == status);
        }

        if (!string.IsNullOrWhiteSpace(assignedTo))
        {
            query = query.Where(todo => todo.AssignedTo == assignedTo);
        }

        if (plannedDate is not null)
        {
            query = query.Where(todo => todo.PlannedDate == plannedDate.Value);
        }

        return await query
            .OrderBy(todo => todo.PlannedDate)
            .ThenBy(todo => todo.Id)
            .ToArrayAsync(cancellationToken);
    }

    public Task<TodoItem?> GetByIdAsync(int id, CancellationToken cancellationToken)
    {
        return _dbContext.TodoItems
            .FirstOrDefaultAsync(todo => todo.Id == id, cancellationToken);
    }

    public async Task AddAsync(TodoItem todoItem, CancellationToken cancellationToken)
    {
        await _dbContext.TodoItems.AddAsync(todoItem, cancellationToken);
    }

    public void Remove(TodoItem todoItem)
    {
        _dbContext.TodoItems.Remove(todoItem);
    }

    public Task SaveChangesAsync(CancellationToken cancellationToken)
    {
        return _dbContext.SaveChangesAsync(cancellationToken);
    }
}
