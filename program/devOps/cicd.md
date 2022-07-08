自动化测试是CI的关键



#### 测试类型

- 单元测试Unite tests：验证每个独立方法级别
- 集成测试Intergration tests：保证模块间运行正常，包括多个模块，多个服务

- 验收测试Acceptance tests：与集成测试类似，但是仅关注业务case，而不是模块内部本身
- UI测试UI tests：从用户角度保证呈现正确运行



- 功能测试类型:

- - 单元测试(Unit testing)
  - 集成测试(Integration testing)

- - 系统测试(System testing)
  - 健全性测试(Sanity testing)

- - 冒烟测试(Smoke testing)：一般发生在daily build之后，简单的测试，是测试流程的开关
  - 接口测试(Interface testing)

- - 回归测试(Regression testing)：在修改任意模块或者功能后，将应用作为一个整体进行测试，称为回归测试
  - Beta/验收测试(Beta/Acceptance testing)

- 非功能测试类型:

- - 性能测试(Performance Testing)
  - 负载测试(Load testing)

- - 压力测试(Stress testing)
  - 容量测试(Volume testing)

- - 安全测试(Security testing)
  - 兼容性测试(Compatibility testing)

- - 安装测试(Install testing)
  - 恢复测试(Recovery testing)

- - 可靠性测试(Reliability testing)
  - 可用性测试(Usability testing)

- - 一致性测试(Compliance testing)
  - 本地化测试(Localization testing)



#### CI文化

- 尽早集成。如果很长时间不合并代码，代码冲突的风险就越高，代码冲突的范围就越广。如果发现某些分支会影响已经存在的分支，需要增加发布关闭标签，避免发布时两个分支冲突。
- 保证编译时时刻刻畅通。一旦发现任何编译问题，立刻修复，否则可能会带来更多的错误。测试套件需要尽快反馈测试结果，或者优先返回短时间测试（单元测试）的结果，否则开发者可能就切换回开发了。一旦编译出错，需要通知给开发者，或者更进一步给出一个 dashboard，每个人都可以在这里查看编译结果。

- 把测试用例纳入流程的一部分。确保每个分支都有自动化测试用例。似乎编写测试用例拖慢了项目节奏，但是它可以减少回归时间，减少每次迭代带来的 bug。而且每次测试通过后，将会非常有信息合并到主干分支，因为新增的内容不影响以前的功能。
- 修 bug 的时候编写测试用例。把 bug 的每个场景都编写成测试用例，避免再次出现。



#### 集成测试步骤

- 从最严格的代码部分入手测试
- 搭建一个自动构建的服务自动运行测试用例，在每次提交代码后。

- 确保团队成员每天合并变更
- 代码出现问题及时修复

- 为每个新实现的操作编写测试用例。 可能看着很简单，但是要求团队能够真正落地。一开始你需要放慢发布的脚步，需要和 pd、用户沟通确保不上线没有测试用例的新功能。我们的建议是从小处入手，通过简单的测试来适应新的例程，然后再着手实现更复杂更难管理的测试套件。







### 