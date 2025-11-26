namespace FinLog.Server.Models
{
    public class IncomeDto
    {
        public int iid { get; set; }
        public DateTime date { get; set; }
        public decimal amount { get; set; }
        public string? description { get; set; }
        public decimal budget { get; set; }
        public int account_id { get; set; }
        public string? account_name { get; set; }
    }
}
