using Microsoft.EntityFrameworkCore;
using SignumTodo.Api.Models;

namespace SignumTodo.Api.Data;

public sealed class TodoDbContext(DbContextOptions<TodoDbContext> options) : DbContext(options)
{
    public DbSet<TodoItem> Todos => Set<TodoItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var todo = modelBuilder.Entity<TodoItem>();
        todo.ToTable("todos");
        todo.HasKey(item => item.Id);
        todo.Property(item => item.Id).HasColumnName("id");
        todo.Property(item => item.Title).HasColumnName("title").HasMaxLength(200).IsRequired();
        todo.Property(item => item.Description).HasColumnName("description").HasMaxLength(1000);
        todo.Property(item => item.Assignee).HasColumnName("assignee").HasMaxLength(100).IsRequired();
        todo.Property(item => item.DueDate).HasColumnName("due_date").HasColumnType("date");
        todo.Property(item => item.Status).HasColumnName("status").HasConversion<string>().HasMaxLength(20);
        todo.Property(item => item.CreatedAtUtc).HasColumnName("created_at_utc");
        todo.Property(item => item.UpdatedAtUtc).HasColumnName("updated_at_utc");

    }
}
