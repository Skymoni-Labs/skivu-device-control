# 手机操控预览版

这套功能由三个独立部分组成：Skivu宿主、手机操控Web插件、Android设备伴侣。当前为开发预览，未加入正式更新和市场目录。需要Android11或更新系统；已验证API36模拟器，尚未验证厂商实体机与真实模型成功率。

1. 安装[独立宿主预览](https://github.com/skyjjgw/skivu/releases/tag/device-control-preview-20261027)。名称为“Skivu 操控预览”，包名`com.skyjjgw.independent.ski.devicepreview`，可与原App并存，数据独立。它使用正常App入口和真实模型调用路径，不含固定QA规划器。后续手动更新预览包；不要通过此预览尝试覆盖正式App。
2. 在宿主配置自己的可用模型连接，或通过正常账号界面使用已开放模型。模型调用会按所选连接计费。插件拿不到宿主模型密钥。
3. 下载并安装[设备伴侣0.1.0](https://github.com/skyjjgw/skivu-device-bridge/releases/tag/v0.1.0)。在伴侣中打开系统无障碍设置，亲自启用服务。日常同机操作不需要Root、ADB或电脑。
4. 下载[手机操控插件0.1.1](https://github.com/skyjjgw/skivu-device-control/releases/tag/v0.1.1)中的`.skivu.json`，在宿主插件管理中点击“导入插件”，安装并核对权限后启用。
5. 在插件页查找设备伴侣、连接，打开伴侣核对客户端包名与签名后批准，再回插件读取软件列表。
6. 选择一个允许操作的软件，填写明确任务，核对模型、软件范围、步骤和时间预算后开始。先用测试便签或只读查询验收。发送、付款、删除等关键标签点击，以及坐标/无标签点击，须在伴侣中逐次确认；密码、验证码和系统授权由自己处理。

任务运行时可从系统通知停止，也可在伴侣“立即停止并撤销所有客户端”。已经注入系统的动作可能完成；执行结果不确定时需要人工核对，程序不会自动重放。

如需正常角色聊天准备任务，在插件页面“绑定到角色 / 聊天任务草稿”中为角色单独绑定并打开随聊工具。角色只能生成待确认草稿卡；点击卡片后仍须选择实际软件并单独批准。软件名称提示不是包名授权。角色/会话不匹配或已被新草稿替代的旧卡片会拒绝读取。

文字界面模式不支持所有自绘控件；截图模型规划、暂停/恢复和专用软件流程尚未实现。模型可能规划错误，不应把点击回执当作外部交易完成证明。完整边界见[验收记录](verification.md)。

个人仓库是主仓库；组织副本：[插件](https://github.com/Skymoni-Labs/skivu-device-control)、[伴侣](https://github.com/Skymoni-Labs/skivu-device-bridge)、[宿主预览](https://github.com/Skymoni-Labs/skivu/releases/tag/device-control-preview-20261027)。
