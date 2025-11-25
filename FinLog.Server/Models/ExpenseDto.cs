namespace FinLog.Server.Models
{
    public class ExpenseDto
    {
        public int eid { get; set; }
        public DateTime edate { get; set; }
        public decimal eamount { get; set; }
        public int cid { get; set; }
        public string? cname { get; set; }
        public int uid { get; set; }
    }
}
