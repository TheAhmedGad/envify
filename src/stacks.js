import { dotnetStack } from './stacks/dotnet-stack.js'
import { laravelStack } from './stacks/laravel-stack.js'
import { customStack } from './stacks/custom-stack.js'

const stacks = {
  Laravel: laravelStack,
  DotNet: dotnetStack,
  Custom: customStack
}

export { stacks }
