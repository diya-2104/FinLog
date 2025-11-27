namespace FinLog.Server.Models
{
    public class IncomeDto
    {
        public int iid { get; set; }
        public DateTime date { get; set; }
        public decimal amount { get; set; }
        public decimal Budget { get; set; }
        public int cid { get; set; }
        public string? cname { get; set; }
        public int account_id { get; set; }
        public string? account_name { get; set; }
    }
}
