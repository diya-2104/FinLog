using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FinLog.Server.Models
{
        [Table("Category")]
        public class Category
        {
            [Key] public int cid { get; set; }
            [Required] public string ?cname { get; set; }
            [Required] public int uid { get; set; }
            [ForeignKey("uid")] public User? User { get; set; }
            public string color { get; set; } = "#FFD1DC";
        public ICollection<Expense>? Expenses { get; set; }
    }
}
