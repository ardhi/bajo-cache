# Changes

## 2026-04-25

- [2.7.0] Change options to format value using the new key set by dobo
- [2.7.0] Remove ```options.retainOriginalValue``` since it is not needed anymore

## 2026-04-21

- [2.5.1] Bug fix in all dobo's record hooks
- [2.5.1] Bug fix in ```store.js```
- [2.5.1] Default ttl for all models is now set to ```5s```
- [2.6.0] Revert back to NOT using hooks for setting/getting/clearing cache

## 2026-04-16

- [2.5.0] Add ```afterRemoveRecord()``` hook for auto clearing cache
- [2.5.0] Add ```afterUpdateRecord()``` hook for auto clearing cache
- [2.5.0] Use the new ```dobo:dt``` feature for ```storage.exp``` field
- [2.5.0] ```clear()``` can now clear certain keys/key patterns
- [2.5.0] Change ```key``` structure to use md5 instead of base64
- [2.5.0] Simplify cache ```set()``` ing

## 2026-04-11

- [2.4.1] Bug fix in ```storage.json```

## 2026-03-27

- [2.4.0] Add waibuDb schema for ```CacheStorage```
- [2.4.0] Bug fix in ```storage.json``` model

## 2026-03-23

- [2.3.0] Upgrade to ```keyv@5.6.0```
- [2.3.0] File structure changes
- [2.3.1] No longer use hook to invalidate cache
- [2.3.2] Bring back exported route that accidently deleted

## 2025-12-21

- [2.2.0] Set, get & clear operations for result sets now handled automatically via system hooks

## 2025-12-18

- [2.2.0] Upgrade to ```keyv@5.5.5```
- [2.2.0] Rewrite neccessary changes to match ```bajo@2.2.x```