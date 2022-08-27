## MULTISIG

### PHEONIX MAINNET

```
export CHAIN_ID="phoenix-1"
export LCD_CLIENT_URL="https://phoenix-lcd.terra.dev"
export MULTISIG_PUBLIC_KEYS="AyVK5PP4dj6NASMsBVfiQz7BVFbu7NQtxy7MEO5GU+zu,AwIfik9A03RggZnOSqaPiUV7QmYB9q2Bjqo4GatUYD1Q,AnxpRHnIgK87A0KeaWFl4WHdvMAVZOXws9djv2oy8qCO,As6SGQO7FBxSDGsnYIR1UIjDN49H+GDq+0wztGD5Dxjf,A780aoCv9l3U1if2XSA6EOs1NCXAK2Yyj+eozKBm8LLn"
export MULTISIG_THRESHOLD=3
```

```

```

node --loader ts-node/esm create_unsigned_tx.ts

node --loader ts-node/esm broadcast_tx.ts

```

```
