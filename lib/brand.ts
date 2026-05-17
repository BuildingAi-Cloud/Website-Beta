// Brand tokens moved to @buildingsync/core/brand so they can be shared
// 1:1 with the on-prem app. This file is a thin re-export so existing
// imports (`@/lib/brand`) keep working — new code should prefer
// importing directly from `@buildingsync/core/brand`.

export { brand, isCanonicalBrand } from "@buildingsync/core/brand";
