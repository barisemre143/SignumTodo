namespace SignumTodo.Application.Common;

public class ValidationException : Exception
{
    public ValidationException(string message)
        : base(message)
    {
    }
}
