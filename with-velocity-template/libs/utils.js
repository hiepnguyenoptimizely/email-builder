const lib = {
    simpleFormatPrice: function(price, digits) {
        return new Intl.NumberFormat(undefined, {
            maximumFractionDigits: digits
        }).format(price)
    }
}

const renderHtml = (vm, context) => {
    const compiler = new Velocity.Compile(Velocity.parse(vm), {escape: false})
    return compiler.render({...context, lib: lib})
}