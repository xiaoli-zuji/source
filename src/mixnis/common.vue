<script>
export default {
  methods: {
    // 更改当前行的状态
    async changeStatus(url, id) {
      // console.log(id);
      const res = await this.$axios.post(url, { id });
      if (res.data.code == 200) {
        this.$message({
          message: "状态更改成功",
          type: "success"
        });
        // 重新查询
        // this.search();
        this.getListDate();
      }
    },
    // 删除
    del(url,id) {
      // console.log(this.page);
      // console.log(this.limit);
      // console.log(this.total);

      this.$confirm(`你确定要删除该条记录吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$axios.post(url, { id });
          if (res.data.code == 200) {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            // 重新查询
            // this.search();
            if (this.total == this.limit * (this.page - 1) + 1) {
              this.page = this.page - 1;
              this.getListDate();
            } else {
              this.getListDate();
            }
          }
        })
        .catch(() => {});
    }
  }
};
</script>
