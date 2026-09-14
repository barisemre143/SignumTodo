using Microsoft.EntityFrameworkCore;
using SignumTodo.Domain.Entities;
using SignumTodo.Domain.Enums;

namespace SignumTodo.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<TodoItem> TodoItems => Set<TodoItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<TodoItem>(entity =>
        {
            entity.Property(todo => todo.TaskDescription)
                .HasMaxLength(500)
                .IsRequired();

            entity.Property(todo => todo.AssignedTo)
                .HasMaxLength(150)
                .IsRequired();

            entity.Property(todo => todo.PlannedDate)
                .HasColumnType("date")
                .IsRequired();

            entity.Property(todo => todo.Status)
                .HasConversion<string>()
                .HasMaxLength(50);

            entity.Ignore(todo => todo.IsCompleted);
            entity.Ignore(todo => todo.IsOverdue);
        });
    }
}
