Для запуска 1 задания ввести в терминал следующие команды:
`cd .\TestingTask\Task1\`

`$env:Path = [Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [Environment]::GetEnvironmentVariable("Path","User")`

`node script.js`

Для запуска второго задания ввести в терминал слеующие команды:
`cd .\TestingTask\`
`npx.cmd playwright test tests/first.spec.ts --headed`