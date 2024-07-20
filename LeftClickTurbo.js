const keybind = "key.wynncraft-spell-caster.spell.melee"
const SPELL_CLICK_PROTECTION = 4 //0.2s

var TURBO_ON = ""
var TO_ATTACK = false


const overlayMessageField = Reflection.getClass("net.minecraft.class_329").getDeclaredField("field_2018");
overlayMessageField.setAccessible(true);

function getOverlayText() {
    return overlayMessageField.get(Client.getMinecraft().field_1705).getString()
}

function isCasting() {
    return /[RL?]-[RL?]-[RL?]/.exec(getOverlayText())
}

if (!World.isWorldLoaded()) JsMacros.waitForEvent('ChunkLoad')

var clickProt = SPELL_CLICK_PROTECTION 
//cancel right click while running
JsMacros.on('Key', true, JavaWrapper.methodToJava((event, context) => {
    if (event.action == 1 && (event.key == "key.mouse.right" || event.key == "key.mouse.left")) {
        var id = Player.getPlayer().getMainHand().getItemId()
        if(id == "minecraft:shears" || id == "minecraft:stick" || id == "minecraft:stone_shovel" || id == "minecraft:iron_shovel" || id == "minecraft:wooden_shovel") {
            if(event.key  == "key.mouse.left") {
                event.cancel()
                KeyBind.pressKeyBind(keybind)
                TURBO_ON = "left"
                TO_ATTACK = true
                console.log(getOverlayText())
            }
            else {
                clickProt = SPELL_CLICK_PROTECTION 
            }
        }
        else if(id == "minecraft:bow") {
            if(event.key == "key.mouse.right") {
                event.cancel()
                KeyBind.pressKeyBind(keybind)
                TURBO_ON = "right"
                TO_ATTACK = true
            }
            else {
                clickProt = SPELL_CLICK_PROTECTION 
            }
        }
    }
    //cancel
    else if(event.action == 0) {
        var id = Player.getPlayer().getMainHand().getItemId()
        if(TURBO_ON == "left" && event.key == "key.mouse.left" && (id == "minecraft:shears" || id == "minecraft:stick" || id == "minecraft:stone_shovel" || id == "minecraft:iron_shovel" || id == "minecraft:wooden_shovel")) {
            event.cancel()
            TURBO_ON = ""
            x = true
        }
        else if(TURBO_ON == "right" && event.key == "key.mouse.right" && id == "minecraft:bow") {
            event.cancel()
            TURBO_ON = ""
        }
    }
}))

var item_cd = -1
var last_item = Player.getPlayer().getMainHand()
var to_attack_timer = -1

while (true) {
    if(TURBO_ON.length > 0) {
        var id = Player.getPlayer().getMainHand().getItemId()
        if(id == "minecraft:shears" || id == "minecraft:stick" || id == "minecraft:stone_shovel" || id == "minecraft:iron_shovel" || id == "minecraft:wooden_shovel") {
            var cd = Player.getPlayer().getItemCooldownRemainingTicks(id)
        
            if(Player.getPlayer().getMainHand().equals(last_item)) {    
                if(cd > item_cd) item_cd = cd
            }
            else {
                item_cd = -1
            }
            
            if(cd != -1) {
                TO_ATTACK = true
            }
            else if(cd == -1 && TO_ATTACK && !isCasting() && clickProt <= 0) {
                KeyBind.pressKeyBind(keybind)
                TO_ATTACK = false
                to_attack_timer = item_cd
            }
            else {
                to_attack_timer--
                if(to_attack_timer <= 0) {
                    TO_ATTACK = true
                }
            }
        }
        else if(id == "minecraft:bow" && !isCasting() && clickProt <= 0) {
            KeyBind.pressKeyBind(keybind)
            Client.waitTick(2)
        }
    }
    else {
        to_attack_timer = -1
    }
    if(clickProt > 0) clickProt--
    Client.waitTick(1)
}