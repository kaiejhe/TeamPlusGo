# Vue 3 + Vite
This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.
Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).

## 如何更新远程仓库的代码
如果你已经在服务器或本地部署了站点，但重新部署后没有看到最新的修改，可以按照以下步骤确认仓库是否已拉取最新的提交：

1. **确认远程地址**
   ```bash
   git remote -v
   ```
   确认 `origin` 指向你在 Git 平台上的仓库地址。

2. **切换到正确的分支**
   ```bash
   git branch
   git checkout <branch-name>
   ```
   部署通常使用 `main` 或 `master` 分支，确保你当前所在的分支与部署使用的分支一致。

3. **拉取最新提交**
   ```bash
   git pull origin <branch-name>
   ```
   该命令会获取远程最新提交并合并到当前分支。如果出现冲突，请先解决冲突再继续。

4. **重新安装依赖并构建（如果需要）**
   ```bash
   npm install
   npm run build
   ```
   确认构建步骤顺利完成，再重新部署构建产物。

5. **检查部署流程**
   - 如果使用的是手动复制构建文件，确认你复制的是最新 `dist/` 目录。
   - 如果使用自动化部署（CI/CD），检查流水线是否成功运行且使用了最新提交。

通过上述步骤，可以确保仓库拉取到最新代码并正确部署。
