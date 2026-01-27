(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/ui/card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Card",
    ()=>Card,
    "CardAction",
    ()=>CardAction,
    "CardContent",
    ()=>CardContent,
    "CardDescription",
    ()=>CardDescription,
    "CardFooter",
    ()=>CardFooter,
    "CardHeader",
    ()=>CardHeader,
    "CardTitle",
    ()=>CardTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
function Card(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(11);
    if ($[0] !== "644a63206f1f12f3c8e034c1816f3e0fe4735aae7932044d6d10873e8cecedc3") {
        for(let $i = 0; $i < 11; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "644a63206f1f12f3c8e034c1816f3e0fe4735aae7932044d6d10873e8cecedc3";
    }
    let className;
    let props;
    if ($[1] !== t0) {
        ({ className, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
    } else {
        className = $[2];
        props = $[3];
    }
    let t1;
    let t2;
    if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = {
            y: -5,
            boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)"
        };
        t2 = {
            duration: 0.2
        };
        $[4] = t1;
        $[5] = t2;
    } else {
        t1 = $[4];
        t2 = $[5];
    }
    let t3;
    if ($[6] !== className) {
        t3 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm", className);
        $[6] = className;
        $[7] = t3;
    } else {
        t3 = $[7];
    }
    let t4;
    if ($[8] !== props || $[9] !== t3) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
            whileHover: t1,
            transition: t2,
            "data-slot": "card",
            className: t3,
            ...props
        }, void 0, false, {
            fileName: "[project]/components/ui/card.tsx",
            lineNumber: 53,
            columnNumber: 10
        }, this);
        $[8] = props;
        $[9] = t3;
        $[10] = t4;
    } else {
        t4 = $[10];
    }
    return t4;
}
_c = Card;
function CardHeader(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "644a63206f1f12f3c8e034c1816f3e0fe4735aae7932044d6d10873e8cecedc3") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "644a63206f1f12f3c8e034c1816f3e0fe4735aae7932044d6d10873e8cecedc3";
    }
    let className;
    let props;
    if ($[1] !== t0) {
        ({ className, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
    } else {
        className = $[2];
        props = $[3];
    }
    let t1;
    if ($[4] !== className) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            "data-slot": "card-header",
            className: t1,
            ...props
        }, void 0, false, {
            fileName: "[project]/components/ui/card.tsx",
            lineNumber: 94,
            columnNumber: 10
        }, this);
        $[6] = props;
        $[7] = t1;
        $[8] = t2;
    } else {
        t2 = $[8];
    }
    return t2;
}
_c1 = CardHeader;
function CardTitle(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "644a63206f1f12f3c8e034c1816f3e0fe4735aae7932044d6d10873e8cecedc3") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "644a63206f1f12f3c8e034c1816f3e0fe4735aae7932044d6d10873e8cecedc3";
    }
    let className;
    let props;
    if ($[1] !== t0) {
        ({ className, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
    } else {
        className = $[2];
        props = $[3];
    }
    let t1;
    if ($[4] !== className) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("leading-none font-semibold", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            "data-slot": "card-title",
            className: t1,
            ...props
        }, void 0, false, {
            fileName: "[project]/components/ui/card.tsx",
            lineNumber: 135,
            columnNumber: 10
        }, this);
        $[6] = props;
        $[7] = t1;
        $[8] = t2;
    } else {
        t2 = $[8];
    }
    return t2;
}
_c2 = CardTitle;
function CardDescription(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "644a63206f1f12f3c8e034c1816f3e0fe4735aae7932044d6d10873e8cecedc3") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "644a63206f1f12f3c8e034c1816f3e0fe4735aae7932044d6d10873e8cecedc3";
    }
    let className;
    let props;
    if ($[1] !== t0) {
        ({ className, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
    } else {
        className = $[2];
        props = $[3];
    }
    let t1;
    if ($[4] !== className) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-muted-foreground text-sm", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            "data-slot": "card-description",
            className: t1,
            ...props
        }, void 0, false, {
            fileName: "[project]/components/ui/card.tsx",
            lineNumber: 176,
            columnNumber: 10
        }, this);
        $[6] = props;
        $[7] = t1;
        $[8] = t2;
    } else {
        t2 = $[8];
    }
    return t2;
}
_c3 = CardDescription;
function CardAction(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "644a63206f1f12f3c8e034c1816f3e0fe4735aae7932044d6d10873e8cecedc3") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "644a63206f1f12f3c8e034c1816f3e0fe4735aae7932044d6d10873e8cecedc3";
    }
    let className;
    let props;
    if ($[1] !== t0) {
        ({ className, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
    } else {
        className = $[2];
        props = $[3];
    }
    let t1;
    if ($[4] !== className) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            "data-slot": "card-action",
            className: t1,
            ...props
        }, void 0, false, {
            fileName: "[project]/components/ui/card.tsx",
            lineNumber: 217,
            columnNumber: 10
        }, this);
        $[6] = props;
        $[7] = t1;
        $[8] = t2;
    } else {
        t2 = $[8];
    }
    return t2;
}
_c4 = CardAction;
function CardContent(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "644a63206f1f12f3c8e034c1816f3e0fe4735aae7932044d6d10873e8cecedc3") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "644a63206f1f12f3c8e034c1816f3e0fe4735aae7932044d6d10873e8cecedc3";
    }
    let className;
    let props;
    if ($[1] !== t0) {
        ({ className, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
    } else {
        className = $[2];
        props = $[3];
    }
    let t1;
    if ($[4] !== className) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("px-6", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            "data-slot": "card-content",
            className: t1,
            ...props
        }, void 0, false, {
            fileName: "[project]/components/ui/card.tsx",
            lineNumber: 258,
            columnNumber: 10
        }, this);
        $[6] = props;
        $[7] = t1;
        $[8] = t2;
    } else {
        t2 = $[8];
    }
    return t2;
}
_c5 = CardContent;
function CardFooter(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(9);
    if ($[0] !== "644a63206f1f12f3c8e034c1816f3e0fe4735aae7932044d6d10873e8cecedc3") {
        for(let $i = 0; $i < 9; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "644a63206f1f12f3c8e034c1816f3e0fe4735aae7932044d6d10873e8cecedc3";
    }
    let className;
    let props;
    if ($[1] !== t0) {
        ({ className, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
    } else {
        className = $[2];
        props = $[3];
    }
    let t1;
    if ($[4] !== className) {
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center px-6 [.border-t]:pt-6", className);
        $[4] = className;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    let t2;
    if ($[6] !== props || $[7] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            "data-slot": "card-footer",
            className: t1,
            ...props
        }, void 0, false, {
            fileName: "[project]/components/ui/card.tsx",
            lineNumber: 299,
            columnNumber: 10
        }, this);
        $[6] = props;
        $[7] = t1;
        $[8] = t2;
    } else {
        t2 = $[8];
    }
    return t2;
}
_c6 = CardFooter;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6;
__turbopack_context__.k.register(_c, "Card");
__turbopack_context__.k.register(_c1, "CardHeader");
__turbopack_context__.k.register(_c2, "CardTitle");
__turbopack_context__.k.register(_c3, "CardDescription");
__turbopack_context__.k.register(_c4, "CardAction");
__turbopack_context__.k.register(_c5, "CardContent");
__turbopack_context__.k.register(_c6, "CardFooter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", {
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground hover:bg-primary/90",
            destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
            outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
            link: "text-primary underline-offset-4 hover:underline"
        },
        size: {
            default: "h-9 px-4 py-2 has-[>svg]:px-3",
            sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
            lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
            icon: "size-9",
            "icon-sm": "size-8",
            "icon-lg": "size-10"
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default"
    }
});
function Button(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(17);
    if ($[0] !== "4012b4d0846b1a9937b3822cd218fc0893353f7a8e3601ac83a6d24829266d2f") {
        for(let $i = 0; $i < 17; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "4012b4d0846b1a9937b3822cd218fc0893353f7a8e3601ac83a6d24829266d2f";
    }
    let className;
    let props;
    let t1;
    let t2;
    let t3;
    if ($[1] !== t0) {
        ({ className, variant: t1, size: t2, asChild: t3, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
        $[4] = t1;
        $[5] = t2;
        $[6] = t3;
    } else {
        className = $[2];
        props = $[3];
        t1 = $[4];
        t2 = $[5];
        t3 = $[6];
    }
    const variant = t1 === undefined ? "default" : t1;
    const size = t2 === undefined ? "default" : t2;
    const asChild = t3 === undefined ? false : t3;
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"] : "button";
    let t4;
    if ($[7] !== className || $[8] !== size || $[9] !== variant) {
        t4 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        }));
        $[7] = className;
        $[8] = size;
        $[9] = variant;
        $[10] = t4;
    } else {
        t4 = $[10];
    }
    let t5;
    if ($[11] !== Comp || $[12] !== props || $[13] !== size || $[14] !== t4 || $[15] !== variant) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
            "data-slot": "button",
            "data-variant": variant,
            "data-size": size,
            className: t4,
            ...props
        }, void 0, false, {
            fileName: "[project]/components/ui/button.tsx",
            lineNumber: 84,
            columnNumber: 10
        }, this);
        $[11] = Comp;
        $[12] = props;
        $[13] = size;
        $[14] = t4;
        $[15] = variant;
        $[16] = t5;
    } else {
        t5 = $[16];
    }
    return t5;
}
_c = Button;
;
var _c;
__turbopack_context__.k.register(_c, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/badge.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Badge",
    ()=>Badge,
    "badgeVariants",
    ()=>badgeVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
;
const badgeVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden", {
    variants: {
        variant: {
            default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
            secondary: "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
            destructive: "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
            outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground"
        }
    },
    defaultVariants: {
        variant: "default"
    }
});
function Badge(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(13);
    if ($[0] !== "5e40a1e1d60b0e75e80bd19c2f360b0ae0f0c5c6cd6fa4aa9f6ea52efc052339") {
        for(let $i = 0; $i < 13; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "5e40a1e1d60b0e75e80bd19c2f360b0ae0f0c5c6cd6fa4aa9f6ea52efc052339";
    }
    let className;
    let props;
    let t1;
    let variant;
    if ($[1] !== t0) {
        ({ className, variant, asChild: t1, ...props } = t0);
        $[1] = t0;
        $[2] = className;
        $[3] = props;
        $[4] = t1;
        $[5] = variant;
    } else {
        className = $[2];
        props = $[3];
        t1 = $[4];
        variant = $[5];
    }
    const asChild = t1 === undefined ? false : t1;
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"] : "span";
    let t2;
    if ($[6] !== className || $[7] !== variant) {
        t2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(badgeVariants({
            variant
        }), className);
        $[6] = className;
        $[7] = variant;
        $[8] = t2;
    } else {
        t2 = $[8];
    }
    let t3;
    if ($[9] !== Comp || $[10] !== props || $[11] !== t2) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
            "data-slot": "badge",
            className: t2,
            ...props
        }, void 0, false, {
            fileName: "[project]/components/ui/badge.tsx",
            lineNumber: 64,
            columnNumber: 10
        }, this);
        $[9] = Comp;
        $[10] = props;
        $[11] = t2;
        $[12] = t3;
    } else {
        t3 = $[12];
    }
    return t3;
}
_c = Badge;
;
var _c;
__turbopack_context__.k.register(_c, "Badge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/utils/api-client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [app-client] (ecmascript)");
;
;
// Create axios instance
const apiClient = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: ("TURBOPACK compile-time value", "https://dcgkzuouqeznxtfzgdil.supabase.co/functions/v1") || 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});
// Add token to requests (use anon key for public endpoints)
apiClient.interceptors.request.use(async (config)=>{
    console.log('API Client: Adding token to request', config.url);
    // For public registration endpoint, use anon key instead of user JWT
    if (config.url?.includes('/auth/joven/registro')) {
        console.log('API Client: Using anon key for public registration endpoint');
        config.headers.Authorization = `Bearer ${"TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjZ2t6dW91cWV6bnh0ZnpnZGlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4NDg3ODcsImV4cCI6MjA4NDQyNDc4N30.ZFKcXa54jCIv5OTMdwBbsVQSqy6KwWlWbaIEHPt041M"}`;
        return config;
    }
    const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
    console.log('API Client: Session data', {
        hasSession: !!data.session,
        hasToken: !!data.session?.access_token
    });
    if (data.session?.access_token) {
        config.headers.Authorization = `Bearer ${data.session.access_token}`;
        console.log('API Client: Token added to Authorization header');
    } else {
        console.log('API Client: No token available');
    }
    return config;
});
// Handle errors
apiClient.interceptors.response.use((response)=>response, (error)=>{
    if (error.response?.status === 401) {
        // Handle unauthorized
        localStorage.removeItem('auth_token');
    }
    return Promise.reject(error);
});
const __TURBOPACK__default__export__ = apiClient;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/useCumpleanos.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCumpleanos",
    ()=>useCumpleanos
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/api-client.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
const calculateAge = (birthDate)=>{
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || monthDiff === 0 && today.getDate() < birth.getDate()) {
        age--;
    }
    return age;
};
const getJovenesParaHoy = (jovenes)=>{
    const today = new Date();
    return jovenes.filter((joven)=>{
        if (!joven.fecha_nacimiento) return false;
        const birth = new Date(joven.fecha_nacimiento);
        return birth.getMonth() === today.getMonth() && birth.getDate() === today.getDate();
    }).map((joven)=>({
            id: joven.id,
            nombre_completo: joven.nombre_completo,
            edad: calculateAge(joven.fecha_nacimiento),
            celular: joven.celular,
            fecha_nacimiento: joven.fecha_nacimiento
        }));
};
const getJovenesParaLaSemana = (jovenes)=>{
    const today = new Date();
    const diasDelaSemana = [];
    for(let i = 1; i <= 6; i++){
        const fecha = new Date(today);
        fecha.setDate(fecha.getDate() + i);
        const jovenesdel = jovenes.filter((joven)=>{
            if (!joven.fecha_nacimiento) return false;
            const birth = new Date(joven.fecha_nacimiento);
            return birth.getMonth() === fecha.getMonth() && birth.getDate() === fecha.getDate();
        }).map((joven)=>({
                id: joven.id,
                nombre_completo: joven.nombre_completo,
                edad: calculateAge(joven.fecha_nacimiento),
                celular: joven.celular,
                fecha_nacimiento: joven.fecha_nacimiento
            }));
        if (jovenesdel.length > 0) {
            const nombresDias = [
                'domingo',
                'lunes',
                'martes',
                'miércoles',
                'jueves',
                'viernes',
                'sábado'
            ];
            const nombreDia = nombresDias[fecha.getDay()];
            const fechaFormato = fecha.toISOString().split('T')[0];
            diasDelaSemana.push({
                dia: nombreDia.charAt(0).toUpperCase() + nombreDia.slice(1),
                fecha: fechaFormato,
                jovenes: jovenesdel
            });
        }
    }
    return diasDelaSemana;
};
const getEstadisticasMes = (jovenes)=>{
    const today = new Date();
    const mesActual = today.getMonth();
    const cumpleanerosMes = jovenes.filter((joven)=>{
        if (!joven.fecha_nacimiento) return false;
        const birth = new Date(joven.fecha_nacimiento);
        return birth.getMonth() === mesActual;
    });
    return {
        totalEnMes: cumpleanerosMes.length,
        enviados: Math.floor(cumpleanerosMes.length * 0.67),
        // Simulado
        pendientes: cumpleanerosMes.length - Math.floor(cumpleanerosMes.length * 0.67)
    };
};
const getProximos30Dias = (jovenes)=>{
    const today = new Date();
    const diasProximos = [];
    const jovenasConFecha = jovenes.filter((joven)=>joven.fecha_nacimiento).map((joven)=>{
        const birth = new Date(joven.fecha_nacimiento);
        let proxCumple = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
        if (proxCumple < today) {
            proxCumple = new Date(today.getFullYear() + 1, birth.getMonth(), birth.getDate());
        }
        const diasRestantes = Math.floor((proxCumple.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return {
            id: joven.id,
            nombre_completo: joven.nombre_completo,
            fecha_nacimiento: joven.fecha_nacimiento,
            dias: diasRestantes
        };
    });
    return jovenasConFecha.filter((j)=>j.dias <= 30).sort((a, b)=>a.dias - b.dias);
};
const useCumpleanos = ()=>{
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(20);
    if ($[0] !== "2fdca304ce6bc4d22dcd4c2c96a0844b1aaf62eefdafd829e6525aaf0eecef9f") {
        for(let $i = 0; $i < 20; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "2fdca304ce6bc4d22dcd4c2c96a0844b1aaf62eefdafd829e6525aaf0eecef9f";
    }
    let t0;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = {
            queryKey: [
                "cumpleanos-jovenes"
            ],
            queryFn: _temp
        };
        $[1] = t0;
    } else {
        t0 = $[1];
    }
    const { data: t1, isLoading, error } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])(t0);
    let t2;
    if ($[2] !== t1) {
        t2 = t1 === undefined ? [] : t1;
        $[2] = t1;
        $[3] = t2;
    } else {
        t2 = $[3];
    }
    const jovenes = t2;
    let t3;
    if ($[4] !== jovenes) {
        t3 = getJovenesParaHoy(jovenes);
        $[4] = jovenes;
        $[5] = t3;
    } else {
        t3 = $[5];
    }
    const cumpleanosHoy = t3;
    let t4;
    if ($[6] !== jovenes) {
        t4 = getJovenesParaLaSemana(jovenes);
        $[6] = jovenes;
        $[7] = t4;
    } else {
        t4 = $[7];
    }
    const cumpleanosSemana = t4;
    let t5;
    if ($[8] !== jovenes) {
        t5 = getEstadisticasMes(jovenes);
        $[8] = jovenes;
        $[9] = t5;
    } else {
        t5 = $[9];
    }
    const estadisticasMes = t5;
    let t6;
    if ($[10] !== jovenes) {
        t6 = getProximos30Dias(jovenes);
        $[10] = jovenes;
        $[11] = t6;
    } else {
        t6 = $[11];
    }
    const proximos30 = t6;
    let t7;
    if ($[12] !== cumpleanosHoy || $[13] !== cumpleanosSemana || $[14] !== error || $[15] !== estadisticasMes || $[16] !== isLoading || $[17] !== jovenes.length || $[18] !== proximos30) {
        t7 = {
            isLoading,
            error,
            cumpleanosHoy,
            cumpleanosSemana,
            estadisticasMes,
            proximos30,
            totalJovenes: jovenes.length
        };
        $[12] = cumpleanosHoy;
        $[13] = cumpleanosSemana;
        $[14] = error;
        $[15] = estadisticasMes;
        $[16] = isLoading;
        $[17] = jovenes.length;
        $[18] = proximos30;
        $[19] = t7;
    } else {
        t7 = $[19];
    }
    return t7;
};
_s(useCumpleanos, "l8BKW8tCtCeSKc2ZHVFf5Hhq7iM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
async function _temp() {
    const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/jovenes");
    return data.jovenes || data.data || [];
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/dashboard/cumpleanos/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CumpleanosPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar.js [app-client] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gift$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Gift$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/gift.js [app-client] (ecmascript) <export default as Gift>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/send.js [app-client] (ecmascript) <export default as Send>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cake$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Cake$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/cake.js [app-client] (ecmascript) <export default as Cake>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/phone.js [app-client] (ecmascript) <export default as Phone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$party$2d$popper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PartyPopper$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/party-popper.js [app-client] (ecmascript) <export default as PartyPopper>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bell.js [app-client] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useCumpleanos$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useCumpleanos.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
function CumpleanosPage() {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(55);
    if ($[0] !== "49b5fd52e6b03daf5b6180662b59d2eac8d5c6de7101b838c37cd8bc3879dab5") {
        for(let $i = 0; $i < 55; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "49b5fd52e6b03daf5b6180662b59d2eac8d5c6de7101b838c37cd8bc3879dab5";
    }
    const { isLoading, cumpleanosHoy, cumpleanosSemana, estadisticasMes, jovenesPorMes, proximos30 } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useCumpleanos$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCumpleanos"])();
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("hoy");
    let t0;
    if ($[1] !== cumpleanosHoy.length) {
        t0 = {
            id: "hoy",
            label: "Hoy",
            count: cumpleanosHoy.length,
            icon: StarIcon
        };
        $[1] = cumpleanosHoy.length;
        $[2] = t0;
    } else {
        t0 = $[2];
    }
    let t1;
    if ($[3] !== cumpleanosSemana) {
        t1 = cumpleanosSemana.reduce(_CumpleanosPageCumpleanosSemanaReduce, 0);
        $[3] = cumpleanosSemana;
        $[4] = t1;
    } else {
        t1 = $[4];
    }
    let t2;
    if ($[5] !== t1) {
        t2 = {
            id: "semana",
            label: "Esta Semana",
            count: t1,
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"]
        };
        $[5] = t1;
        $[6] = t2;
    } else {
        t2 = $[6];
    }
    let t3;
    if ($[7] !== estadisticasMes.totalEnMes) {
        t3 = {
            id: "mes",
            label: "Este Mes",
            count: estadisticasMes.totalEnMes,
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"]
        };
        $[7] = estadisticasMes.totalEnMes;
        $[8] = t3;
    } else {
        t3 = $[8];
    }
    let t4;
    if ($[9] !== proximos30.length) {
        t4 = {
            id: "proximos30",
            label: "Pr\xF3ximos 30 d\xEDas",
            count: proximos30.length,
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"]
        };
        $[9] = proximos30.length;
        $[10] = t4;
    } else {
        t4 = $[10];
    }
    let t5;
    if ($[11] !== t0 || $[12] !== t2 || $[13] !== t3 || $[14] !== t4) {
        t5 = [
            t0,
            t2,
            t3,
            t4
        ];
        $[11] = t0;
        $[12] = t2;
        $[13] = t3;
        $[14] = t4;
        $[15] = t5;
    } else {
        t5 = $[15];
    }
    const tabs = t5;
    let t6;
    if ($[16] === Symbol.for("react.memo_cache_sentinel")) {
        t6 = ({
            "CumpleanosPage[handleTabClick]": (id)=>setActiveTab(id)
        })["CumpleanosPage[handleTabClick]"];
        $[16] = t6;
    } else {
        t6 = $[16];
    }
    const handleTabClick = t6;
    const handleEnviarFelicitacion = _CumpleanosPageHandleEnviarFelicitacion;
    if (isLoading) {
        let t7;
        let t8;
        if ($[17] === Symbol.for("react.memo_cache_sentinel")) {
            t7 = {
                scale: [
                    1,
                    1.1,
                    1
                ],
                rotate: [
                    0,
                    5,
                    -5,
                    0
                ]
            };
            t8 = {
                duration: 2,
                repeat: Infinity
            };
            $[17] = t7;
            $[18] = t8;
        } else {
            t7 = $[17];
            t8 = $[18];
        }
        let t9;
        if ($[19] === Symbol.for("react.memo_cache_sentinel")) {
            t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col justify-center items-center h-[60vh] space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        animate: t7,
                        transition: t8,
                        className: "h-16 w-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/10",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cake$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Cake$3e$__["Cake"], {
                            size: 32
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                            lineNumber: 133,
                            columnNumber: 252
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                        lineNumber: 133,
                        columnNumber: 90
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs",
                        children: "Preparando celebraciones..."
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                        lineNumber: 133,
                        columnNumber: 283
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                lineNumber: 133,
                columnNumber: 12
            }, this);
            $[19] = t9;
        } else {
            t9 = $[19];
        }
        return t9;
    }
    let t7;
    if ($[20] === Symbol.for("react.memo_cache_sentinel")) {
        t7 = {
            opacity: 0,
            y: 10
        };
        $[20] = t7;
    } else {
        t7 = $[20];
    }
    let t8;
    if ($[21] === Symbol.for("react.memo_cache_sentinel")) {
        t8 = {
            hidden: t7,
            visible: {
                opacity: 1,
                y: 0,
                transition: {
                    duration: 0.4,
                    staggerChildren: 0.1
                }
            }
        };
        $[21] = t8;
    } else {
        t8 = $[21];
    }
    const containerVariants = t8;
    let t9;
    if ($[22] === Symbol.for("react.memo_cache_sentinel")) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2 mb-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-6 w-1 bg-blue-600 rounded-full"
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                            lineNumber: 170,
                            columnNumber: 61
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-3xl font-black text-slate-900 tracking-tight",
                            children: "Calendario de Cumpleaños"
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                            lineNumber: 170,
                            columnNumber: 113
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                    lineNumber: 170,
                    columnNumber: 15
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-slate-500 font-medium",
                    children: "Gestionar felicitaciones y celebrar la vida de nuestros jóvenes"
                }, void 0, false, {
                    fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                    lineNumber: 170,
                    columnNumber: 214
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
            lineNumber: 170,
            columnNumber: 10
        }, this);
        $[22] = t9;
    } else {
        t9 = $[22];
    }
    let t10;
    if ($[23] === Symbol.for("react.memo_cache_sentinel")) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-6",
            children: [
                t9,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-3",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        variant: "outline",
                        className: "h-11 rounded-xl border-slate-200 bg-white/50 backdrop-blur-sm font-bold px-6 hover:bg-white",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gift$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Gift$3e$__["Gift"], {
                                size: 18,
                                className: "mr-2 text-rose-500"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                                lineNumber: 177,
                                columnNumber: 266
                            }, this),
                            "Gestionar Plantillas"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                        lineNumber: 177,
                        columnNumber: 136
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                    lineNumber: 177,
                    columnNumber: 108
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
            lineNumber: 177,
            columnNumber: 11
        }, this);
        $[23] = t10;
    } else {
        t10 = $[23];
    }
    let t11;
    if ($[24] !== activeTab || $[25] !== tabs) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-wrap items-center gap-2 p-1.5 bg-slate-100/80 backdrop-blur-md rounded-2xl w-full md:w-fit",
            children: tabs.map({
                "CumpleanosPage[tabs.map()]": (tab)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-2", activeTab === tab.id ? "bg-white text-blue-600 shadow-sm ring-1 ring-slate-200" : "text-slate-500 hover:text-slate-900 hover:bg-white/40"),
                        onClick: {
                            "CumpleanosPage[tabs.map() > <button>.onClick]": ()=>handleTabClick(tab.id)
                        }["CumpleanosPage[tabs.map() > <button>.onClick]"],
                        children: [
                            activeTab === tab.id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                layoutId: "active-tab",
                                className: "absolute inset-0 bg-white rounded-xl -z-10"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                                lineNumber: 187,
                                columnNumber: 86
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(tab.icon, {
                                size: 16
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                                lineNumber: 187,
                                columnNumber: 178
                            }, this),
                            tab.label,
                            tab.count > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("ml-1 px-1.5 py-0.5 rounded-md text-[10px] font-black", activeTab === tab.id ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"),
                                children: tab.count
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                                lineNumber: 187,
                                columnNumber: 229
                            }, this)
                        ]
                    }, tab.id, true, {
                        fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                        lineNumber: 185,
                        columnNumber: 46
                    }, this)
            }["CumpleanosPage[tabs.map()]"])
        }, void 0, false, {
            fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
            lineNumber: 184,
            columnNumber: 11
        }, this);
        $[24] = activeTab;
        $[25] = tabs;
        $[26] = t11;
    } else {
        t11 = $[26];
    }
    let t12;
    let t13;
    let t14;
    let t15;
    if ($[27] === Symbol.for("react.memo_cache_sentinel")) {
        t12 = {
            opacity: 0,
            x: 10
        };
        t13 = {
            opacity: 1,
            x: 0
        };
        t14 = {
            opacity: 0,
            x: -10
        };
        t15 = {
            duration: 0.3
        };
        $[27] = t12;
        $[28] = t13;
        $[29] = t14;
        $[30] = t15;
    } else {
        t12 = $[27];
        t13 = $[28];
        t14 = $[29];
        t15 = $[30];
    }
    let t16;
    if ($[31] !== activeTab || $[32] !== cumpleanosHoy) {
        t16 = activeTab === "hoy" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
            children: cumpleanosHoy.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                className: "col-span-full p-12 flex flex-col items-center justify-center border-dashed border-2 bg-slate-50/50 rounded-[2.5rem] border-slate-200",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-6",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                            size: 40,
                            strokeWidth: 1.5
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                            lineNumber: 227,
                            columnNumber: 391
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                        lineNumber: 227,
                        columnNumber: 285
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-xl font-black text-slate-900 mb-2",
                        children: "Hoy no hay cumpleaños"
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                        lineNumber: 227,
                        columnNumber: 437
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-slate-500 text-sm font-medium",
                        children: "¡No te preocupes! Siempre hay tiempo para celebrar."
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                        lineNumber: 227,
                        columnNumber: 518
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                lineNumber: 227,
                columnNumber: 134
            }, this) : cumpleanosHoy.map({
                "CumpleanosPage[cumpleanosHoy.map()]": (joven_0)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(BirthdayCard, {
                        joven: joven_0,
                        onAction: {
                            "CumpleanosPage[cumpleanosHoy.map() > <BirthdayCard>.onAction]": ()=>handleEnviarFelicitacion(joven_0)
                        }["CumpleanosPage[cumpleanosHoy.map() > <BirthdayCard>.onAction]"],
                        variant: "today"
                    }, joven_0.id, false, {
                        fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                        lineNumber: 228,
                        columnNumber: 59
                    }, this)
            }["CumpleanosPage[cumpleanosHoy.map()]"])
        }, void 0, false, {
            fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
            lineNumber: 227,
            columnNumber: 34
        }, this);
        $[31] = activeTab;
        $[32] = cumpleanosHoy;
        $[33] = t16;
    } else {
        t16 = $[33];
    }
    let t17;
    if ($[34] !== activeTab || $[35] !== cumpleanosSemana) {
        t17 = activeTab === "semana" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
            children: cumpleanosSemana.map({
                "CumpleanosPage[cumpleanosSemana.map()]": (dia_0)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3 px-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-2 w-2 rounded-full bg-blue-600"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                                        lineNumber: 241,
                                        columnNumber: 151
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-sm font-black uppercase tracking-widest text-slate-500",
                                        children: dia_0.dia
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                                        lineNumber: 241,
                                        columnNumber: 203
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs font-bold text-slate-300 ml-auto",
                                        children: dia_0.fecha
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                                        lineNumber: 241,
                                        columnNumber: 295
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                                lineNumber: 241,
                                columnNumber: 105
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-4",
                                children: dia_0.jovenes.map({
                                    "CumpleanosPage[cumpleanosSemana.map() > dia_0.jovenes.map()]": (joven_1)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(BirthdayCard, {
                                            joven: joven_1,
                                            onAction: {
                                                "CumpleanosPage[cumpleanosSemana.map() > dia_0.jovenes.map() > <BirthdayCard>.onAction]": ()=>handleEnviarFelicitacion(joven_1)
                                            }["CumpleanosPage[cumpleanosSemana.map() > dia_0.jovenes.map() > <BirthdayCard>.onAction]"],
                                            variant: "upcoming"
                                        }, joven_1.id, false, {
                                            fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                                            lineNumber: 242,
                                            columnNumber: 90
                                        }, this)
                                }["CumpleanosPage[cumpleanosSemana.map() > dia_0.jovenes.map()]"])
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                                lineNumber: 241,
                                columnNumber: 380
                            }, this)
                        ]
                    }, dia_0.fecha, true, {
                        fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                        lineNumber: 241,
                        columnNumber: 60
                    }, this)
            }["CumpleanosPage[cumpleanosSemana.map()]"])
        }, void 0, false, {
            fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
            lineNumber: 240,
            columnNumber: 37
        }, this);
        $[34] = activeTab;
        $[35] = cumpleanosSemana;
        $[36] = t17;
    } else {
        t17 = $[36];
    }
    let t18;
    if ($[37] !== activeTab || $[38] !== estadisticasMes.enviados || $[39] !== estadisticasMes.pendientes || $[40] !== estadisticasMes.totalEnMes || $[41] !== jovenesPorMes) {
        t18 = activeTab === "mes" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 md:grid-cols-3 gap-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MiniStatCard, {
                            label: "Total del Mes",
                            value: estadisticasMes.totalEnMes,
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"],
                            color: "blue"
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                            lineNumber: 255,
                            columnNumber: 116
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MiniStatCard, {
                            label: "Felicicaciones Enviadas",
                            value: estadisticasMes.enviados,
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__["Send"],
                            color: "emerald"
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                            lineNumber: 255,
                            columnNumber: 218
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MiniStatCard, {
                            label: "Pendientes por Felicitar",
                            value: estadisticasMes.pendientes,
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"],
                            color: "amber"
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                            lineNumber: 255,
                            columnNumber: 327
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                    lineNumber: 255,
                    columnNumber: 61
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                    className: "p-8 border-slate-200/60 shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3 mb-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-10 w-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                        size: 20
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                                        lineNumber: 255,
                                        columnNumber: 686
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                                    lineNumber: 255,
                                    columnNumber: 588
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-lg font-black text-slate-900 tracking-tight",
                                    children: "Listado Completo Mensual"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                                    lineNumber: 255,
                                    columnNumber: 712
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                            lineNumber: 255,
                            columnNumber: 542
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "divide-y divide-slate-100",
                            children: jovenesPorMes.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "py-12 text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4 mx-auto",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                            size: 32,
                                            strokeWidth: 1.5
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                                            lineNumber: 255,
                                            columnNumber: 1034
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                                        lineNumber: 255,
                                        columnNumber: 920
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-slate-400 font-medium",
                                        children: "No hay cumpleaños este mes"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                                        lineNumber: 255,
                                        columnNumber: 1080
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                                lineNumber: 255,
                                columnNumber: 885
                            }, this) : jovenesPorMes.map({
                                "CumpleanosPage[jovenesPorMes.map()]": (joven_2, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "py-4 flex items-center justify-between hover:bg-slate-50 transition-colors group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-md transition-all",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                            size: 24,
                                                            strokeWidth: 1.5
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                                                            lineNumber: 256,
                                                            columnNumber: 385
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                                                        lineNumber: 256,
                                                        columnNumber: 228
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-base font-bold text-slate-900",
                                                                children: joven_2.nombre_completo
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                                                                lineNumber: 256,
                                                                columnNumber: 432
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-3 mt-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-xs font-bold text-slate-400 flex items-center gap-1",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                                                                size: 12
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                                                                                lineNumber: 256,
                                                                                columnNumber: 632
                                                                            }, this),
                                                                            new Date(joven_2.fecha_nacimiento).toLocaleDateString("es-ES", {
                                                                                day: "numeric",
                                                                                month: "long"
                                                                            }),
                                                                            " • ",
                                                                            joven_2.edad,
                                                                            " años"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                                                                        lineNumber: 256,
                                                                        columnNumber: 557
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-xs font-bold text-slate-400 flex items-center gap-1",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__["Phone"], {
                                                                                size: 12
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                                                                                lineNumber: 259,
                                                                                columnNumber: 130
                                                                            }, this),
                                                                            joven_2.celular
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                                                                        lineNumber: 259,
                                                                        columnNumber: 55
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                                                                lineNumber: 256,
                                                                columnNumber: 511
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                                                        lineNumber: 256,
                                                        columnNumber: 427
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                                                lineNumber: 256,
                                                columnNumber: 187
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                variant: "ghost",
                                                size: "sm",
                                                className: "h-10 rounded-xl hover:bg-blue-50 hover:text-blue-600 font-bold px-4",
                                                onClick: {
                                                    "CumpleanosPage[jovenesPorMes.map() > <Button>.onClick]": ()=>handleEnviarFelicitacion(joven_2)
                                                }["CumpleanosPage[jovenesPorMes.map() > <Button>.onClick]"],
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__["Send"], {
                                                        size: 16,
                                                        className: "mr-2"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                                                        lineNumber: 261,
                                                        columnNumber: 76
                                                    }, this),
                                                    "Felicitar"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                                                lineNumber: 259,
                                                columnNumber: 191
                                            }, this)
                                        ]
                                    }, joven_2.id, true, {
                                        fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                                        lineNumber: 256,
                                        columnNumber: 72
                                    }, this)
                            }["CumpleanosPage[jovenesPorMes.map()]"])
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                            lineNumber: 255,
                            columnNumber: 812
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                    lineNumber: 255,
                    columnNumber: 444
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
            lineNumber: 255,
            columnNumber: 34
        }, this);
        $[37] = activeTab;
        $[38] = estadisticasMes.enviados;
        $[39] = estadisticasMes.pendientes;
        $[40] = estadisticasMes.totalEnMes;
        $[41] = jovenesPorMes;
        $[42] = t18;
    } else {
        t18 = $[42];
    }
    let t19;
    if ($[43] !== activeTab || $[44] !== proximos30) {
        t19 = activeTab === "proximos30" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
            className: "overflow-hidden border-slate-200/60 shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-8 border-b border-slate-100 flex items-center justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-xl font-black text-slate-900 tracking-tight",
                                    children: "Próximos 30 días"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                                    lineNumber: 274,
                                    columnNumber: 237
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-slate-500 font-medium",
                                    children: "Organiza y programa tus felicitaciones"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                                    lineNumber: 274,
                                    columnNumber: 323
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                            lineNumber: 274,
                            columnNumber: 232
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-12 w-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"], {
                                size: 24
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                                lineNumber: 274,
                                columnNumber: 518
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                            lineNumber: 274,
                            columnNumber: 421
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                    lineNumber: 274,
                    columnNumber: 151
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "divide-y divide-slate-50",
                    children: proximos30.map({
                        "CumpleanosPage[proximos30.map()]": (joven_3)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-md transition-all",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                    size: 24,
                                                    strokeWidth: 1.5
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                                                    lineNumber: 275,
                                                    columnNumber: 370
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                                                lineNumber: 275,
                                                columnNumber: 213
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-base font-bold text-slate-900",
                                                        children: joven_3.nombre_completo
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                                                        lineNumber: 275,
                                                        columnNumber: 417
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-3 mt-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-xs font-bold text-slate-400 flex items-center gap-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                                                        size: 12
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                                                                        lineNumber: 275,
                                                                        columnNumber: 617
                                                                    }, this),
                                                                    joven_3.fecha_nacimiento
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                                                                lineNumber: 275,
                                                                columnNumber: 542
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                                variant: "outline",
                                                                className: "text-[10px] font-black uppercase text-blue-600 border-blue-100 bg-blue-50/50",
                                                                children: [
                                                                    "Faltan ",
                                                                    joven_3.dias,
                                                                    " días"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                                                                lineNumber: 275,
                                                                columnNumber: 672
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                                                        lineNumber: 275,
                                                        columnNumber: 496
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                                                lineNumber: 275,
                                                columnNumber: 412
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                                        lineNumber: 275,
                                        columnNumber: 172
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "ghost",
                                        size: "sm",
                                        className: "h-10 rounded-xl hover:bg-blue-50 hover:text-blue-600 font-bold px-4",
                                        onClick: {
                                            "CumpleanosPage[proximos30.map() > <Button>.onClick]": ()=>handleEnviarFelicitacion(joven_3)
                                        }["CumpleanosPage[proximos30.map() > <Button>.onClick]"],
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                size: 16,
                                                className: "mr-2"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                                                lineNumber: 277,
                                                columnNumber: 71
                                            }, this),
                                            "Programar"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                                        lineNumber: 275,
                                        columnNumber: 838
                                    }, this)
                                ]
                            }, joven_3.id, true, {
                                fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                                lineNumber: 275,
                                columnNumber: 58
                            }, this)
                    }["CumpleanosPage[proximos30.map()]"])
                }, void 0, false, {
                    fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                    lineNumber: 274,
                    columnNumber: 548
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
            lineNumber: 274,
            columnNumber: 41
        }, this);
        $[43] = activeTab;
        $[44] = proximos30;
        $[45] = t19;
    } else {
        t19 = $[45];
    }
    let t20;
    if ($[46] !== activeTab || $[47] !== t16 || $[48] !== t17 || $[49] !== t18 || $[50] !== t19) {
        t20 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
            mode: "wait",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                initial: t12,
                animate: t13,
                exit: t14,
                transition: t15,
                className: "space-y-6",
                children: [
                    t16,
                    t17,
                    t18,
                    t19
                ]
            }, activeTab, true, {
                fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                lineNumber: 287,
                columnNumber: 40
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
            lineNumber: 287,
            columnNumber: 11
        }, this);
        $[46] = activeTab;
        $[47] = t16;
        $[48] = t17;
        $[49] = t18;
        $[50] = t19;
        $[51] = t20;
    } else {
        t20 = $[51];
    }
    let t21;
    if ($[52] !== t11 || $[53] !== t20) {
        t21 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
            className: "space-y-8 pb-12",
            initial: "hidden",
            animate: "visible",
            variants: containerVariants,
            children: [
                t10,
                t11,
                t20
            ]
        }, void 0, true, {
            fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
            lineNumber: 299,
            columnNumber: 11
        }, this);
        $[52] = t11;
        $[53] = t20;
        $[54] = t21;
    } else {
        t21 = $[54];
    }
    return t21;
}
_s(CumpleanosPage, "xP/TdPApokMh5qX9w/cz03GGhko=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useCumpleanos$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCumpleanos"]
    ];
});
_c = CumpleanosPage;
function _CumpleanosPageHandleEnviarFelicitacion(joven) {
    const message = encodeURIComponent(`¡Hola ${joven.nombre_completo}! 🎉 Que Dios te bendiga grandemente en este día de tu cumpleaños. Te deseamos lo mejor desde IPUC Conquistadores. 🙏🎂`);
    window.open(`https://wa.me/${joven.celular}?text=${message}`, "_blank");
}
function _CumpleanosPageCumpleanosSemanaReduce(acc, dia) {
    return acc + dia.jovenes.length;
}
function BirthdayCard(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(51);
    if ($[0] !== "49b5fd52e6b03daf5b6180662b59d2eac8d5c6de7101b838c37cd8bc3879dab5") {
        for(let $i = 0; $i < 51; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "49b5fd52e6b03daf5b6180662b59d2eac8d5c6de7101b838c37cd8bc3879dab5";
    }
    const { joven, onAction, variant: t1 } = t0;
    const variant = t1 === undefined ? "today" : t1;
    const isToday = variant === "today";
    let t2;
    let t3;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = {
            hidden: {
                opacity: 0,
                scale: 0.95
            },
            visible: {
                opacity: 1,
                scale: 1
            }
        };
        t3 = {
            y: -5
        };
        $[1] = t2;
        $[2] = t3;
    } else {
        t2 = $[1];
        t3 = $[2];
    }
    const t4 = isToday ? "bg-white ring-2 ring-blue-500/20" : "bg-white/70 backdrop-blur-md";
    let t5;
    if ($[3] !== t4) {
        t5 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative overflow-hidden border-slate-200/60 shadow-lg group-hover:shadow-2xl transition-all duration-300 p-6 rounded-[2rem]", t4);
        $[3] = t4;
        $[4] = t5;
    } else {
        t5 = $[4];
    }
    let t6;
    if ($[5] !== isToday) {
        t6 = isToday && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "absolute -top-10 -right-10 h-32 w-32 bg-blue-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"
        }, void 0, false, {
            fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
            lineNumber: 368,
            columnNumber: 21
        }, this);
        $[5] = isToday;
        $[6] = t6;
    } else {
        t6 = $[6];
    }
    const t7 = isToday ? "bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600" : "bg-slate-200";
    let t8;
    if ($[7] !== t7) {
        t8 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-24 w-24 rounded-3xl p-1 shadow-2xl transition-transform duration-500 group-hover:rotate-6", t7);
        $[7] = t7;
        $[8] = t8;
    } else {
        t8 = $[8];
    }
    let t9;
    if ($[9] !== joven.nombre_completo) {
        t9 = joven.nombre_completo.charAt(0);
        $[9] = joven.nombre_completo;
        $[10] = t9;
    } else {
        t9 = $[10];
    }
    let t10;
    if ($[11] !== t9) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "h-full w-full rounded-[1.4rem] bg-white flex items-center justify-center text-2xl font-black text-slate-900 border border-slate-100",
            children: t9
        }, void 0, false, {
            fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
            lineNumber: 393,
            columnNumber: 11
        }, this);
        $[11] = t9;
        $[12] = t10;
    } else {
        t10 = $[12];
    }
    let t11;
    if ($[13] !== t10 || $[14] !== t8) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t8,
            children: t10
        }, void 0, false, {
            fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
            lineNumber: 401,
            columnNumber: 11
        }, this);
        $[13] = t10;
        $[14] = t8;
        $[15] = t11;
    } else {
        t11 = $[15];
    }
    let t12;
    if ($[16] !== isToday) {
        t12 = isToday && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "absolute -bottom-2 -right-2 h-10 w-10 bg-rose-500 text-white rounded-2xl flex items-center justify-center shadow-lg border-4 border-white animate-bounce",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$party$2d$popper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PartyPopper$3e$__["PartyPopper"], {
                size: 20
            }, void 0, false, {
                fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                lineNumber: 410,
                columnNumber: 192
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
            lineNumber: 410,
            columnNumber: 22
        }, this);
        $[16] = isToday;
        $[17] = t12;
    } else {
        t12 = $[17];
    }
    let t13;
    if ($[18] !== t11 || $[19] !== t12) {
        t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative",
            children: [
                t11,
                t12
            ]
        }, void 0, true, {
            fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
            lineNumber: 418,
            columnNumber: 11
        }, this);
        $[18] = t11;
        $[19] = t12;
        $[20] = t13;
    } else {
        t13 = $[20];
    }
    let t14;
    if ($[21] !== joven.nombre_completo) {
        t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
            className: "text-xl font-black text-slate-900 tracking-tight line-clamp-1",
            children: joven.nombre_completo
        }, void 0, false, {
            fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
            lineNumber: 427,
            columnNumber: 11
        }, this);
        $[21] = joven.nombre_completo;
        $[22] = t14;
    } else {
        t14 = $[22];
    }
    const t15 = isToday ? "text-blue-600" : "text-slate-500";
    let t16;
    if ($[23] !== t15) {
        t16 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-sm font-bold", t15);
        $[23] = t15;
        $[24] = t16;
    } else {
        t16 = $[24];
    }
    const t17 = isToday ? `¡Hoy cumple ${joven.edad} años! 🎂` : `Cumplirá ${joven.edad} años`;
    let t18;
    if ($[25] !== t16 || $[26] !== t17) {
        t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: t16,
            children: t17
        }, void 0, false, {
            fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
            lineNumber: 445,
            columnNumber: 11
        }, this);
        $[25] = t16;
        $[26] = t17;
        $[27] = t18;
    } else {
        t18 = $[27];
    }
    let t19;
    if ($[28] === Symbol.for("react.memo_cache_sentinel")) {
        t19 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__["Phone"], {
            size: 12,
            strokeWidth: 3
        }, void 0, false, {
            fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
            lineNumber: 454,
            columnNumber: 11
        }, this);
        $[28] = t19;
    } else {
        t19 = $[28];
    }
    let t20;
    if ($[29] !== joven.celular) {
        t20 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "text-xs font-bold text-slate-400 flex items-center gap-1.5",
            children: [
                t19,
                joven.celular
            ]
        }, void 0, true, {
            fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
            lineNumber: 461,
            columnNumber: 11
        }, this);
        $[29] = joven.celular;
        $[30] = t20;
    } else {
        t20 = $[30];
    }
    let t21;
    if ($[31] !== t18 || $[32] !== t20) {
        t21 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col items-center gap-1.5 mt-2",
            children: [
                t18,
                t20
            ]
        }, void 0, true, {
            fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
            lineNumber: 469,
            columnNumber: 11
        }, this);
        $[31] = t18;
        $[32] = t20;
        $[33] = t21;
    } else {
        t21 = $[33];
    }
    let t22;
    if ($[34] !== t14 || $[35] !== t21) {
        t22 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t14,
                t21
            ]
        }, void 0, true, {
            fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
            lineNumber: 478,
            columnNumber: 11
        }, this);
        $[34] = t14;
        $[35] = t21;
        $[36] = t22;
    } else {
        t22 = $[36];
    }
    const t23 = isToday ? "bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/10" : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20";
    let t24;
    if ($[37] !== t23) {
        t24 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-full h-12 rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg transition-all", t23);
        $[37] = t23;
        $[38] = t24;
    } else {
        t24 = $[38];
    }
    let t25;
    if ($[39] === Symbol.for("react.memo_cache_sentinel")) {
        t25 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__["Send"], {
            size: 18,
            className: "mr-2"
        }, void 0, false, {
            fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
            lineNumber: 496,
            columnNumber: 11
        }, this);
        $[39] = t25;
    } else {
        t25 = $[39];
    }
    let t26;
    if ($[40] !== onAction || $[41] !== t24) {
        t26 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
            onClick: onAction,
            className: t24,
            children: [
                t25,
                "Enviar Felicitación"
            ]
        }, void 0, true, {
            fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
            lineNumber: 503,
            columnNumber: 11
        }, this);
        $[40] = onAction;
        $[41] = t24;
        $[42] = t26;
    } else {
        t26 = $[42];
    }
    let t27;
    if ($[43] !== t13 || $[44] !== t22 || $[45] !== t26) {
        t27 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col gap-5 items-center text-center",
            children: [
                t13,
                t22,
                t26
            ]
        }, void 0, true, {
            fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
            lineNumber: 512,
            columnNumber: 11
        }, this);
        $[43] = t13;
        $[44] = t22;
        $[45] = t26;
        $[46] = t27;
    } else {
        t27 = $[46];
    }
    let t28;
    if ($[47] !== t27 || $[48] !== t5 || $[49] !== t6) {
        t28 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
            variants: t2,
            whileHover: t3,
            className: "group",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                className: t5,
                children: [
                    t6,
                    t27
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
                lineNumber: 522,
                columnNumber: 71
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
            lineNumber: 522,
            columnNumber: 11
        }, this);
        $[47] = t27;
        $[48] = t5;
        $[49] = t6;
        $[50] = t28;
    } else {
        t28 = $[50];
    }
    return t28;
}
_c1 = BirthdayCard;
function MiniStatCard(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(22);
    if ($[0] !== "49b5fd52e6b03daf5b6180662b59d2eac8d5c6de7101b838c37cd8bc3879dab5") {
        for(let $i = 0; $i < 22; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "49b5fd52e6b03daf5b6180662b59d2eac8d5c6de7101b838c37cd8bc3879dab5";
    }
    const { label, value, icon: Icon, color } = t0;
    let T0;
    let t1;
    let t2;
    if ($[1] !== color) {
        const colors = {
            blue: "text-blue-600 bg-blue-50 border-blue-100 shadow-blue-500/5",
            emerald: "text-emerald-600 bg-emerald-50 border-emerald-100 shadow-emerald-500/5",
            amber: "text-amber-600 bg-amber-50 border-amber-100 shadow-amber-500/5"
        };
        T0 = __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"];
        t2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-6 flex items-center gap-5 border-slate-100 shadow-xl rounded-[2rem] bg-white transition-all hover:scale-[1.02]", colors[color]);
        t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-14 w-14 rounded-2xl flex items-center justify-center border", colors[color].replace("shadow-", ""));
        $[1] = color;
        $[2] = T0;
        $[3] = t1;
        $[4] = t2;
    } else {
        T0 = $[2];
        t1 = $[3];
        t2 = $[4];
    }
    let t3;
    if ($[5] !== Icon) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
            size: 28
        }, void 0, false, {
            fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
            lineNumber: 575,
            columnNumber: 10
        }, this);
        $[5] = Icon;
        $[6] = t3;
    } else {
        t3 = $[6];
    }
    let t4;
    if ($[7] !== t1 || $[8] !== t3) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t1,
            children: t3
        }, void 0, false, {
            fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
            lineNumber: 583,
            columnNumber: 10
        }, this);
        $[7] = t1;
        $[8] = t3;
        $[9] = t4;
    } else {
        t4 = $[9];
    }
    let t5;
    if ($[10] !== label) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1",
            children: label
        }, void 0, false, {
            fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
            lineNumber: 592,
            columnNumber: 10
        }, this);
        $[10] = label;
        $[11] = t5;
    } else {
        t5 = $[11];
    }
    let t6;
    if ($[12] !== value) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
            className: "text-2xl font-black text-slate-900 tracking-tight",
            children: value
        }, void 0, false, {
            fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
            lineNumber: 600,
            columnNumber: 10
        }, this);
        $[12] = value;
        $[13] = t6;
    } else {
        t6 = $[13];
    }
    let t7;
    if ($[14] !== t5 || $[15] !== t6) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t5,
                t6
            ]
        }, void 0, true, {
            fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
            lineNumber: 608,
            columnNumber: 10
        }, this);
        $[14] = t5;
        $[15] = t6;
        $[16] = t7;
    } else {
        t7 = $[16];
    }
    let t8;
    if ($[17] !== T0 || $[18] !== t2 || $[19] !== t4 || $[20] !== t7) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(T0, {
            className: t2,
            children: [
                t4,
                t7
            ]
        }, void 0, true, {
            fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
            lineNumber: 617,
            columnNumber: 10
        }, this);
        $[17] = T0;
        $[18] = t2;
        $[19] = t4;
        $[20] = t7;
        $[21] = t8;
    } else {
        t8 = $[21];
    }
    return t8;
}
_c2 = MiniStatCard;
const StarIcon = (props)=>{
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(4);
    if ($[0] !== "49b5fd52e6b03daf5b6180662b59d2eac8d5c6de7101b838c37cd8bc3879dab5") {
        for(let $i = 0; $i < 4; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "49b5fd52e6b03daf5b6180662b59d2eac8d5c6de7101b838c37cd8bc3879dab5";
    }
    let t0;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
            points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
        }, void 0, false, {
            fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
            lineNumber: 638,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[1] = t0;
    } else {
        t0 = $[1];
    }
    let t1;
    if ($[2] !== props) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            ...props,
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24",
            fill: "currentColor",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: t0
        }, void 0, false, {
            fileName: "[project]/app/dashboard/cumpleanos/page.tsx",
            lineNumber: 645,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[2] = props;
        $[3] = t1;
    } else {
        t1 = $[3];
    }
    return t1;
};
_c3 = StarIcon;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "CumpleanosPage");
__turbopack_context__.k.register(_c1, "BirthdayCard");
__turbopack_context__.k.register(_c2, "MiniStatCard");
__turbopack_context__.k.register(_c3, "StarIcon");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_8d999177._.js.map