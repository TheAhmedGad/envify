import { dotnetStack } from './stacks/dotnet-stack.js'
import { laravelStack } from './stacks/laravel-stack.js'
import { customStack } from './stacks/custom-stack.js'

const stacks = {
  LaravelStack: laravelStack,
  DotNetStack: dotnetStack,
  CustomStack: customStack
}

export { stacks }
