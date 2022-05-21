# Code Climate Github Action

[![Latest Version](https://img.shields.io/github/v/release/brokeyourbike/codeclimate-action)](https://github.com/brokeyourbike/codeclimate-action/releases)
[![Maintainability](https://api.codeclimate.com/v1/badges/5809b26fe097a7ce7af8/maintainability)](https://codeclimate.com/github/brokeyourbike/codeclimate-action/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/5809b26fe097a7ce7af8/test_coverage)](https://codeclimate.com/github/brokeyourbike/codeclimate-action/test_coverage)

Easily upload coverage reports to Code Climate from GitHub Actions

## Usage

See [action.yml](action.yml)

Basic:
```yaml
steps:
  - uses: actions/checkout@v3
  - uses: brokeyourbike/codeclimate-action@v0.1
    with:
      token: ${{ secrets.CODECLIMATE_TOKEN }}
      files: ./coverage1.xml,./coverage2.xml
```

## Arguments

Input | Description | Usege
`token` | Used to authorize coverage report uploads | Required
`files` | Comma-separated paths to the coverage report(s) | Required

## Authors
- [Ivan Stasiuk](https://github.com/brokeyourbike) | [Twitter](https://twitter.com/brokeyourbike) | [stasi.uk](https://stasi.uk)

## License

The scripts and documentation in this project are released under the [MPL-2.0](https://github.com/brokeyourbike/codeclimate-action/blob/main/LICENSE)