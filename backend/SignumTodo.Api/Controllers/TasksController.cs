using Microsoft.AspNetCore.Mvc;
using SignumTodo.Application.Common;
using SignumTodo.Application.Todos;
using SignumTodo.Application.Todos.Requests;
using SignumTodo.Domain.Enums;
using SignumTodo.Domain.Exceptions;

namespace SignumTodo.Api.Controllers;

[ApiController]
[Route("api/tasks")]
public class TasksController : ControllerBase
{
    private readonly ITodoService _todoService;

    public TasksController(ITodoService todoService)
    {
        _todoService = todoService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] TodoItemStatus? status,
        [FromQuery] string? assignedTo,
        [FromQuery] DateOnly? plannedDate,
        CancellationToken cancellationToken)
    {
        var todoItems = await _todoService.GetAllAsync(status, assignedTo, plannedDate, cancellationToken);

        return Ok(todoItems);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
    {
        var todoItem = await _todoService.GetByIdAsync(id, cancellationToken);

        return todoItem is null ? NotFound() : Ok(todoItem);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateTodoRequest request, CancellationToken cancellationToken)
    {
        try
        {
            var todoItem = await _todoService.CreateAsync(request, cancellationToken);

            return CreatedAtAction(nameof(GetById), new { id = todoItem.Id }, todoItem);
        }
        catch (ValidationException exception)
        {
            return BadRequest(new { message = exception.Message });
        }
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, UpdateTodoRequest request, CancellationToken cancellationToken)
    {
        try
        {
            var todoItem = await _todoService.UpdateAsync(id, request, cancellationToken);

            return todoItem is null ? NotFound() : Ok(todoItem);
        }
        catch (ValidationException exception)
        {
            return BadRequest(new { message = exception.Message });
        }
    }

    [HttpPatch("{id:int}")]
    public async Task<IActionResult> Patch(int id, PatchTodoRequest request, CancellationToken cancellationToken)
    {
        try
        {
            var todoItem = await _todoService.PatchAsync(id, request, cancellationToken);

            return todoItem is null ? NotFound() : Ok(todoItem);
        }
        catch (DomainException exception)
        {
            return BadRequest(new { message = exception.Message });
        }
        catch (ValidationException exception)
        {
            return BadRequest(new { message = exception.Message });
        }
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var isDeleted = await _todoService.DeleteAsync(id, cancellationToken);

        return isDeleted ? NoContent() : NotFound();
    }
}
