using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SignumTodo.Api.Contracts;
using SignumTodo.Api.Data;
using SignumTodo.Api.Models;

namespace SignumTodo.Api.Controllers;

[ApiController]
[Route("api/todos")]
public sealed class TodosController(TodoDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<TodoItem>>> GetAll(CancellationToken cancellationToken)
    {
        var todos = await db.Todos
            .AsNoTracking()
            .OrderBy(item => item.DueDate)
            .ThenByDescending(item => item.CreatedAtUtc)
            .ToListAsync(cancellationToken);

        return Ok(todos);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<TodoItem>> GetById(int id, CancellationToken cancellationToken)
    {
        var todo = await db.Todos.AsNoTracking()
            .SingleOrDefaultAsync(item => item.Id == id, cancellationToken);

        return todo is null ? NotFound() : Ok(todo);
    }

    [HttpPost]
    public async Task<ActionResult<TodoItem>> Create(
        CreateTodoRequest request,
        CancellationToken cancellationToken)
    {
        if (!ValidateRequiredText(request.Title, request.Assignee))
        {
            return ValidationProblem(ModelState);
        }

        var todo = new TodoItem
        {
            Title = request.Title.Trim(),
            Description = NormalizeDescription(request.Description),
            Assignee = request.Assignee.Trim(),
            DueDate = request.DueDate,
            Status = TodoStatus.Todo
        };

        db.Todos.Add(todo);
        await db.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(GetById), new { id = todo.Id }, todo);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<TodoItem>> Update(
        int id,
        UpdateTodoRequest request,
        CancellationToken cancellationToken)
    {
        if (!ValidateRequiredText(request.Title, request.Assignee))
        {
            return ValidationProblem(ModelState);
        }

        var todo = await db.Todos.SingleOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (todo is null)
        {
            return NotFound();
        }

        if (!IsAllowedTransition(todo.Status, request.Status))
        {
            return BadRequest(new
            {
                message = "Aşamalar yalnızca sırayla değiştirilebilir. Todo doğrudan Completed olamaz."
            });
        }

        todo.Title = request.Title.Trim();
        todo.Description = NormalizeDescription(request.Description);
        todo.Assignee = request.Assignee.Trim();
        todo.DueDate = request.DueDate;
        todo.Status = request.Status;
        todo.UpdatedAtUtc = DateTime.UtcNow;

        await db.SaveChangesAsync(cancellationToken);
        return Ok(todo);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var todo = await db.Todos.SingleOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (todo is null)
        {
            return NotFound();
        }

        db.Todos.Remove(todo);
        await db.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    private static string? NormalizeDescription(string? description) =>
        string.IsNullOrWhiteSpace(description) ? null : description.Trim();

    private bool ValidateRequiredText(string title, string assignee)
    {
        if (string.IsNullOrWhiteSpace(title))
        {
            ModelState.AddModelError(nameof(title), "Görev tanımı boş olamaz.");
        }

        if (string.IsNullOrWhiteSpace(assignee))
        {
            ModelState.AddModelError(nameof(assignee), "Atanan kişi boş olamaz.");
        }

        return ModelState.ErrorCount == 0;
    }

    private static bool IsAllowedTransition(TodoStatus current, TodoStatus next) =>
        current == next ||
        (current == TodoStatus.Todo && next == TodoStatus.InProgress) ||
        (current == TodoStatus.InProgress && next is TodoStatus.Todo or TodoStatus.Completed) ||
        (current == TodoStatus.Completed && next == TodoStatus.InProgress);
}
