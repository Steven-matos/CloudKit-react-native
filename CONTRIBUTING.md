# Contributing to React Native CloudKit

Thank you for your interest in contributing to React Native CloudKit! This document provides guidelines and information for contributors.

## Code of Conduct

This project follows the Contributor Covenant Code of Conduct. By participating, you agree to uphold this code.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Xcode (for iOS development)
- React Native development environment

### Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/stevenmatos/react-native-icloud.git
   cd react-native-icloud
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Build the library:**
   ```bash
   npm run build
   # or
   yarn build
   ```

4. **Run tests:**
   ```bash
   npm test
   # or
   yarn test
   ```

5. **Run linting:**
   ```bash
   npm run lint
   # or
   yarn lint
   ```

## Development Guidelines

### Code Style

We follow these principles:
- **SOLID**: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion
- **DRY**: Don't Repeat Yourself
- **KISS**: Keep It Simple, Stupid

### TypeScript

- All new code must be written in TypeScript
- Provide comprehensive type definitions
- Use JSDoc comments for public APIs
- Follow the existing code style and patterns

### Testing

- Write unit tests for all new functionality
- Maintain at least 80% code coverage
- Use descriptive test names
- Test both success and error scenarios

### Documentation

- Update README.md for user-facing changes
- Add JSDoc comments for all public methods
- Include examples for new features
- Update type definitions

## Pull Request Process

1. **Fork the repository** and create your branch from `main`
2. **Create a feature branch** with a descriptive name:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

3. **Make your changes** following the development guidelines
4. **Add tests** for your changes
5. **Update documentation** as needed
6. **Run the test suite** to ensure everything passes:
   ```bash
   npm test
   npm run lint
   npm run build
   ```

7. **Commit your changes** with a clear commit message:
   ```bash
   git commit -m "feat: add new query method for location-based searches"
   # or
   git commit -m "fix: resolve authentication status update issue"
   ```

8. **Push to your fork** and create a Pull Request

### Commit Message Format

We use conventional commits:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
- `feat: add batch save operations`
- `fix: resolve iOS 15 compatibility issue`
- `docs: update installation instructions`
- `test: add unit tests for query builder`

## Issue Reporting

When reporting issues, please include:

1. **Environment information:**
   - React Native version
   - iOS version
   - Node.js version
   - Library version

2. **Steps to reproduce** the issue
3. **Expected behavior**
4. **Actual behavior**
5. **Code samples** if applicable
6. **Screenshots** if relevant

## Feature Requests

For feature requests, please:

1. Check existing issues to avoid duplicates
2. Provide a clear description of the feature
3. Explain the use case and benefits
4. Consider implementation complexity
5. Be open to discussion and feedback

## Development Areas

We welcome contributions in these areas:

### Core Functionality
- CloudKit operations (query, save, delete)
- Authentication and permissions
- Event handling and notifications
- Error handling and recovery

### Developer Experience
- TypeScript definitions
- Documentation and examples
- Testing utilities
- Development tools

### Performance
- Query optimization
- Memory management
- Network efficiency
- Caching strategies

### Platform Integration
- iOS-specific features
- CloudKit dashboard integration
- Apple ecosystem compatibility

## Release Process

Releases are managed through GitHub Actions:

1. **Version bumping** is handled automatically
2. **Changelog generation** from commit messages
3. **npm publishing** to the registry
4. **GitHub releases** with release notes

### Versioning

We follow Semantic Versioning (SemVer):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

## Getting Help

- 📖 Check the [documentation](README.md)
- 🐛 Search [existing issues](https://github.com/stevenmatos/react-native-icloud/issues)
- 💬 Start a [discussion](https://github.com/stevenmatos/react-native-icloud/discussions)
- 📧 Contact maintainers for private concerns

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- GitHub contributors graph

Thank you for contributing to React Native CloudKit! 🚀
