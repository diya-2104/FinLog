
using System.Net;
using System.Net.Mail;

namespace FinLog.Server.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendVerificationEmailAsync(string email, string firstName, string verificationToken)
        {
            var smtpClient = new SmtpClient(_configuration["Email:SmtpServer"]!)
            {
                Port = int.Parse(_configuration["Email:Port"]!),
                Credentials = new NetworkCredential(_configuration["Email:Username"], _configuration["Email:Password"]),
                EnableSsl = true,
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(_configuration["Email:FromAddress"]!, "FinLog"),
                Subject = "Verify Your FinLog Account",
                Body = $"Hi {firstName},\n\nWelcome to FinLog! Please verify your email by clicking the link below:\n\nhttps://localhost:7123/api/register/verify?token={verificationToken}\n\nBest regards,\nFinLog Team",
                IsBodyHtml = false,
            };

            mailMessage.To.Add(email);
            await smtpClient.SendMailAsync(mailMessage);
        }
    }
}
