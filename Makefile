.PHONY: test lint

# 跑全部测试（node:test）
test:
	node --test 'test/**/*.test.mjs'

# 语法检查（node --check 所有源文件）
lint:
	@find src -name '*.mjs' -exec node --check {} \;
