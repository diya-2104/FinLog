namespace FinLog.Server.Services
{
    public interface IEmailService
    {
        Task SendVerificationEmailAsync(string email, string firstName, string verificationToken);
    }
}
