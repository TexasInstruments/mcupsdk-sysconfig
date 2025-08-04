let common = system.getScript("/common");
let soc = system.getScript(`/board/flash/flash_${common.getSocName()}`);

let regDataDescription = `
Certain attributes of the flash are sometimes configured by writing to a register.
This includes but is not limited to STR/DTR settings, protocol configurations (usually
high throughput ones like 4S-4D-4D, 8D-8D-8D etc.) and dummy cycle configurations.

So if any of these attributes are configured using register writes, fill in the
details accordingly here.

The details which need to be filled are

- If the register is addressed or not
- If the register is addressed, give the address as an 8 digit hex value
- Command to read the register
- Command to write the register
- Data to be written to register, along with the bit mask and shift

`
let addressingModeDescription = `
In flashes with size more than 16 MB, we need 4 address bytes to access memory. But most
flashes in reset configuration start with a 3 byte addressing mode setup. 4 byte addressing
mode is handled differently across flashes. There are mainly three types of addressing
supported:

- **0**: 3-Byte only addressing
- **1**: 3-byte or 4-byte addressing (Enters 4-Byte addressing on command)
- **2**: 4-Byte only addressing

Most cases it is Type 1, so there is a sequence of commands which need to be given
to switch to 4 byte addressing mode. It's given here as a bitmap, according to the
flash, the correct bit sequence has to be given in hex for 4 byte enable sequence.

Here 'x' can be 0 or 1.

- xxxxxxx**1** : Issue instruction 0xB7 without write enable
- xxxxxx**1**x : Issue write enable, then issue 0xB7
- xxxxx**1**xx : 8 bit register used to define the 31:24 bits in the address. Set this
             register to switch to the correct memory bank.
- xxxx**1**xxx : Bit 7 of an 8-bit register is used to enable/disable 4 byte address
             mode. When this is 0, other bits of the register can be used to specify
             full address.
- xxx**1**xxxx : 16 bit register used to control 3/4 byte addressing mode. Writing 1
             makes addressing mode as 4 bytes
- xx**1**xxxxx : Supports dedicated 4 byte instruction set. Check datasheet
- x**1**xxxxxx : Always 4 byte mode

`
let flashBusyDescription = `
Flashes support different ways to poll the device's busy status. Two main ways
supported as per JESD216D are:

- 1) Polling bit 7 of flag status register using 0x70 read command, bit value = 1 means ready
- 2) Legacy method of polling the status register RDSR bit 0 (WIP bit), bit value = 0 means ready

Choose the appropriate option for your flash. For most flashes it is option 2.
`
let flashResetDescription = `
Flashes support different types of software reset sequences to return the device to its default power-on state.

Here 'x' can be 0 or 1.

000000 : Soft Reset Not Supported
xxxxx**1** : Drive 0x0F on all 4 data wires for 8 clocks
xxxx**1**x : Drive 0x0F on all 4 data wires for 10 clocks if device is in 4 byte addressing
xxx**1**xx : Drive 0x0F on all 4 data wires for 16 clocks
xx**1**xxx : Issue instruction 0xF0
x**1**xxxx : Issue 0x66 for reset enable, and 0x99 for reset

`
let quadEnableDescription = `
Sequence to enable quad mode **(1s-1s-4s)** changes from flash to flash. According to the JEDEC standards, there are 7 different types of Quad Enable(QE):

 - **0** : Device does not have a QE bit. Detects based on instruction.
 - **1** : QE is bit 1 of status register 2. It is set via Write Status with two data bytes where bit 1 of the second byte is one. It is cleared via Write Status with two data bytes where bit 1 of the second byte is zero. Writing only one byte to the status register has the side-effect of clearing status register 2, including the QE bit.
 - **2** : QE is bit 6 of status register 1. It is set via Write Status with one data byte where bit 6 is one. It is cleared via Write Status with one data byte where bit 6 is zero
 - **3** : QE is bit 7 of status register 2. It is set via Write status register 2 instruction 3Eh with one data byte where bit 7 is one. It is cleared via Write status register 2 instruction "0x3E" with one data byte where bit 7 is zero. The status register 2 is read using instruction "0x3F".
 - **4** : QE is bit 1 of status register 2. It is set via Write Status with two data bytes where bit 1 of the second byte is one. It is cleared via Write Status with two data bytes where bit 1 of the second byte is zero. Writing one byte to the status register does not modify status register 2.
 - **5** : QE is bit 1 of the status register 2. Status register 1 is read using Read Status instruction "0x05". Status register 2 is read using instruction "0x35". QE is set via Write Status instruction 01h with two data bytes where bit 1 of the second byte is one. It is cleared via Write Status with two data bytes where bit 1 of the second byte is zero.
 - **6** : QE is bit 1 of the status register 2. Status register 1 is read using Read Status instruction "0x05". Status register 2 is read using instruction "0x35", and status register 3 is read using instruction "0x15". QE is set via Write Status Register instruction "0x31" with one data byte where bit 1 is one. It is cleared via Write Status Register instruction "0x31" with one data byte where bit 1 is zero.

 `
let octalEnableDescription = `
Sequence to enable octal mode changes from flash to flash. According to the JEDEC standards, these are the different types of Octal Mode Enabling:
- **0** : Device does not have a OE bit. Detects based on instruction.
- **1** : OE is bit 1 of status register 2. It is set via Write Status with two data bytes where bit 1 of the second byte is one. It is cleared via Write Status with two data bytes where bit 1 of the second byte is zero. Writing only one byte to the status register has the side-effect of clearing status register 2, including the QE bit.

`
let seq444Description = `
Sequence to enable 4-4-4 mode from 1-1-1 mode changes from flash to flash. According to the JEDEC standards,
these are the different sequences  for enabling 4-4-4 mode. This is an array of 5 binary flags.
Each flag denotes an operation. Depending on which flag is set, that operation needs to be done.

Here 'x' can be 0 or 1.

- xxxx**1** : Set QE as per QE enable type, then issue instruction 0x38
- xxx**1**x : Issue instruction 0x38
- xx**1**xx : Issue instruction 0x35
- x**1**xxx : Device uses a read-modify-write sequence of operations:
              Read Volatile Enhanced Configuration Register using 0x65,
              followed by 0x800003 address, set bit 6, write back using 0x71
              followed by 0x800003 address.
- **1**xxxx : Device uses a read-modify-write sequence of operations:
              Read Volatile Enhanced Configuration Register using 0x65,
              with no address, reset bit 7 to 0, write back using 0x61,
              with no address.

`
let seq888Description = `
Sequence to enable 4-4-4 mode from 1-1-1 mode changes from flash to flash. According to the JEDEC standards,
these are the different sequences  for enabling 4-4-4 mode. This is an array of 5 binary flags.
Each flag denotes an operation. Depending on which flag is set, that operation needs to be done.

Here 'x' can be 0 or 1.

- xxx**1**x : Issue write enable (0x06), and then issue 0xE8
- xx**1**xx : Issue write enable (0x06), and then issue 0x72 with address 0x00,
              data = 0x01 if 8S-8S-8S or 0x02 if 8D-8D-8D
- 00000     : This type of octal enabling is not supported, use config registers or
              8D commands to set octal mode.

`
let eraseConfigDescription = `
Flashes support multiple erase types / sizes. According to JEDS216 D, there are 4 different erase types / sizes. For simplicity we only consider
2 erase sizes in our config. We call the bigger erase size a **"block"** and smaller erase size a **"sector"**.

Say your flash supports 2 or more) erase types, say 3 erase types - 256KB, 64KB and 4KB

You can choose any two out of these and make the larger one **block** and smaller one **sector**. Say we choose 256 KB as block size and 4 KB as
sector size. The following configurables need to be filled based on the flash you're using:

1. Size of the block in bytes (256 x 1024 = 262144 in this case)
2. Size of the sector in bytes (4 x 1024 = 4096 in this case)
3. CMD to erase block in 3 byte addressing mode
4. CMD to erase block in 4 byte addressing mode
5. CMD to erase sector in 3 byte addressing mode
6. CMD to erase sector in 4 byte addressing mode

`
let customProtoDescription = `
If you have selected a custom protocol, different than the ones already provided, a function to set the
protocol also needs to be provided. This function can be defined in the application, and give the function name here.

The function signature would be
~~~
int32_t myProtocolSetFxn(Flash_Config *cfg)
{
    int32_t status = SystemP_SUCCESS;

    /* Your code for setting the protocol goes here */

    return status;
}
~~~

You can define this function in your application's source. It will be invoked in this fashion:
~~~
Board_open()
    -> Flash_open()
        -> Flash_*Open()
            -> myProtocolSetFxn(Flash_Config *cfg)
~~~

`
let quirksDescription = `
Certain flashes would need extra configurations for the flash to work completely. An example is hybrid sector configuration.
So this is a hook to add such quirks, the function mentioned here would be invoked at the end of the **open** function in flash driver.

The function signature would be
~~~
int32_t myQuirksFxn(Flash_Config *cfg)
{
    int32_t status = SystemP_SUCCESS;

    /* Your code for handling quirks go here */

    return status;
}
~~~

You can define this function in your application's source. It will be invoked in this fashion:
~~~
Board_open()
    -> Flash_open()
        -> Flash_*Open()
            -> myQuirksFxn(Flash_Config *cfg)
~~~

`

let skipInitDesc = `
In some cases, a HW initialization of the flash device in the application may not be
favourable. Typical example is an application with some code eXecuting In Place (XIP).
In these cases, the flash will be configured and initialized by the bootloader and the
application need not initialize it again. If this is the case in your application, please
use this option to skip the HW init in the application.

If this option is ticked, the Board_flashOpen ***will not*** initialize the flash HW.
It will only update the book keeping structures in the software.
`

/* Protocol Configs */
/* 1-1-1 */
let protoToCfgMap = {
    "1s_1s_1s" : "p111",
    "1s_1s_2s" : "p112",
    "1s_1s_4s" : "p114",
    "1s_1s_8s" : "p118",
    "1s_8s_8s" : "p188",
    "4s_4s_4s" : "p444s",
    "4s_4d_4d" : "p444d",
    "8s_8s_8s" : "p888s",
    "8d_8d_8d" : "p888d",
    "custom"   : "pCustom",
}

function getDriver(drvName) {
    return system.getScript(`/drivers/${drvName}/${drvName}`);
}

function getInstanceConfig(moduleInstance) {

    return {
        ...moduleInstance,
    };
};

let defaultProtocols = getDriver(soc.getDefaultDriver()).getSupportedProtocols();

let defProtoJson = soc.getDefaultProtocolJson()

let defNandProtoJson = soc.getDefaultNandProtocolJson()

let flash_module_name = "/board/flash/flash";

let serialNorDefaultCfg = soc.getDefaultFlashConfig();

let serialNandDefaultCfg = soc.getDefaultNandFlashConfig();

let serialNorDefaultName = soc.getDefaultFlashName();
let serialNorDefaultProtocolName = soc.getDefaultProtocol().name;

let serialNandDefaultName = soc.getDefaultNandFlashName();
let serialNandDefaultProtocolName = soc.getDefaultNandProtocol().name;

function changeFlashType(inst, ui)
{
    if(inst.dummy_isAddrReg == true) {
        ui.dummy_cfgReg.hidden = false;
    }
    else
    {
        ui.dummy_cfgReg.hidden = true;
    }

    if(inst.proto_isAddrReg == true) {
        ui.proto_cfgReg.hidden = false;
    }
    else
    {
        ui.proto_cfgReg.hidden = true;
    }

    if(inst.strDtr_isAddrReg == true) {
        ui.strDtr_cfgReg.hidden = false;
    }
    else
    {
        ui.strDtr_cfgReg.hidden = true;
    }

    if(inst.flashType == "SERIAL_NOR")
    {
        ui.cmdWrsr.hidden = true;
        ui.skipHwInit.hidden = false;
        ui.cmdPageLoad.hidden = true;
        ui.cmdPageProg.hidden = true;
        ui.srWriteProtectReg.hidden = true;
        ui.srWriteProtectMask.hidden = true;
        ui.flashSectorSize.hidden = false;
        ui.cmdBlockErase3B.hidden = false;
        ui.cmdBlockErase4B.hidden = false;
        ui.cmdSectorErase3B.hidden = false;
        ui.cmdSectorErase4B.hidden = false;
        ui.cmdBlockErase.hidden = true;

        ui.modeClksCmd.hidden = false;
        ui.modeClksRd.hidden = false;
        ui.flashQeType.hidden = false;
        ui.flashOeType.hidden = false;
        ui.flash444Seq.hidden = false;
        ui.flash888Seq.hidden = false;

        ui.deviceBusyType.hidden = false;
        ui.dummyId4.hidden = false;
        ui.dummyId8.hidden = false;

        ui.srWel.hidden = false;
        ui.srWipReg.hidden = true;
        ui.xspiRdsrDummy.hidden = true;
        ui.xspiWipBit.hidden = false;

        ui.cmdChipErase.hidden = false;
        ui.enable4BAddr.hidden = false;

        ui.addressByteSupport.hidden = false;
        ui.fourByteEnableSeq.hidden = false;
        ui.resetType.hidden = false;
        ui.flashDeviceBusyTimeout.hidden = false;
        ui.flashPageProgTimeout.hidden = false;

        ui.progStatusReg.hidden = true;
        ui.xspiProgStatusReg.hidden = true;
        ui.eraseStatusReg.hidden = true;
        ui.xspiEraseStatusReg.hidden = true;
        ui.srProgStatus.hidden = true;
        ui.srEraseStatus.hidden = true;
        ui.badBlockCheck.hidden = true;
        ui.quirks.hidden = false;
    } else if(inst.flashType == "SERIAL_NAND") {
        ui.cmdWrsr.hidden = false;
        ui.skipHwInit.hidden = true;
        ui.cmdPageLoad.hidden = false;
        ui.cmdPageProg.hidden = false;
        ui.srWriteProtectReg.hidden = false;
        ui.srWriteProtectMask.hidden = false;

        ui.flashSectorSize.hidden = true;
        ui.cmdBlockErase3B.hidden = true;
        ui.cmdBlockErase4B.hidden = true;
        ui.cmdSectorErase3B.hidden = true;
        ui.cmdSectorErase4B.hidden = true;
        ui.cmdBlockErase.hidden = false;

        ui.modeClksCmd.hidden = true;
        ui.modeClksRd.hidden = true;
        ui.flashQeType.hidden = true;
        ui.flashOeType.hidden = true;
        ui.flash444Seq.hidden = true;
        ui.flash888Seq.hidden = true;

        ui.deviceBusyType.hidden = true;
        ui.dummyId4.hidden = true;
        ui.dummyId8.hidden = true;

        ui.srWel.hidden = true;
        ui.srWipReg.hidden = false;
        ui.xspiRdsrDummy.hidden = false;
        ui.xspiWipBit.hidden = true;

        ui.cmdChipErase.hidden = true;
        ui.enable4BAddr.hidden = true;
        ui.addressByteSupport.hidden = true;
        ui.fourByteEnableSeq.hidden = true;
        ui.resetType.hidden = true;
        ui.flashDeviceBusyTimeout.hidden = true;
        ui.flashPageProgTimeout.hidden =true;

        ui.progStatusReg.hidden = false;
        ui.xspiProgStatusReg.hidden = false;

        ui.eraseStatusReg.hidden = false;
        ui.xspiEraseStatusReg.hidden = false;

        ui.srProgStatus.hidden = false;
        ui.srEraseStatus.hidden = false;
        ui.badBlockCheck.hidden = false;
        ui.quirks.hidden = true;
    }
}

let flash_module = {
    displayName: "FLASH",
    templates: {
        "/board/board/board_open_close.c.xdt": {
            board_open_close_config: "/board/flash/templates/v2/flash_open_close_config.c.xdt",
            board_open: "/board/flash/templates/flash_open.c.xdt",
            board_close: "/board/flash/templates/flash_close.c.xdt",
        },
        "/board/board/board_open_close.h.xdt": {
            board_open_close_config: "/board/flash/templates/flash_open_close.h.xdt",
        },
        "/board/board/board_config.h.xdt": {
            board_config: "/board/flash/templates/flash.h.xdt",
        },
        "/board/board/board_config.c.xdt": {
            flash_reset: "/board/flash/templates/flash_reset.c.xdt", 
        }

    },
    defaultInstanceName: "CONFIG_FLASH",
    collapsed: false,
    config:  getConfigurables(),
    validate: validate,
    moduleStatic: {
        modules: function(inst) {
            return [{
                name: "system_common",
                moduleName: "/system_common",
            }]
        },
    },
    moduleInstances: moduleInstances,
    getInstanceConfig,
};

function getConfigurables()
{
    let config = [];
    config.push(
        {
            name: "device",
            displayName: "Flash Device",
            default: "TI_DEFAULT_FLASH",
            options: [
                { name: "TI_DEFAULT_FLASH" , displayName: "TI Board Default Flash" },
                { name: "CUSTOM_FLASH" , displayName: "Custom Flash" },
            ],
            onChange: function(inst, ui) {
                if(inst.device == "TI_DEFAULT_FLASH") {
                    inst.fname = soc.getDefaultFlashName();
                    inst.protocol = soc.getDefaultProtocol().name;
                    ui.customFlashResetFxn.hidden = true;
                } else if(inst.device == "CUSTOM_FLASH") {
                    inst.fname = "";
                    if(inst.enableFlashReset == true){
                        ui.customFlashResetFxn.hidden = false;
                    }
                }
            }
        },
        {
            name: "skipHwInit",
            displayName: "Skip HW Init",
            longDescription: skipInitDesc,
            default: false,
        },
        {
            name: "flashType",
            displayName: "Flash Type",
            default: "SERIAL_NOR",
            options: [
                { name: "SERIAL_NOR", displayName: "Serial Nor Flash" },
                { name: "SERIAL_NAND", displayName: "Serial Nand Flash" },
            ],
            onChange: function(inst,ui) {
                if(inst.flashType == "SERIAL_NOR") {
                    inst.fname = serialNorDefaultName;
                    inst.protocol = serialNorDefaultProtocolName;
                    inst.flashSize = serialNorDefaultCfg.flashSize;
                    inst.flashPageSize = serialNorDefaultCfg.flashPageSize;

                    inst.flashManfId = serialNorDefaultCfg.flashManfId;
                    inst.flashDeviceId = serialNorDefaultCfg.flashDeviceId;

                    inst.flashBlockSize = serialNorDefaultCfg.flashBlockSize;
                    inst.flashSectorSize = serialNorDefaultCfg.flashSectorSize;
                    inst.cmdBlockErase3B = serialNorDefaultCfg.cmdBlockErase3B;
                    inst.cmdBlockErase4B = serialNorDefaultCfg.cmdBlockErase4B;
                    inst.cmdSectorErase3B = serialNorDefaultCfg.cmdSectorErase3B;
                    inst.cmdSectorErase4B = serialNorDefaultCfg.cmdSectorErase4B;

                    inst.cmdRd = serialNorDefaultCfg.protos[defProtoJson].cmdRd;
                    inst.cmdWr = serialNorDefaultCfg.protos[defProtoJson].cmdWr;
                    inst.dummyClksCmd = serialNorDefaultCfg.protos[defProtoJson].dummyClksCmd;
                    inst.dummyClksRd = serialNorDefaultCfg.protos[defProtoJson].dummyClksRd;

                    inst.dummy_isAddrReg = serialNorDefaultCfg.protos[defProtoJson].dummyCfg == null ? false : serialNorDefaultCfg.protos[defProtoJson].dummyCfg.isAddrReg;
                    inst.dummy_cfgReg = serialNorDefaultCfg.protos[defProtoJson].dummyCfg == null ? "0x00" : serialNorDefaultCfg.protos[defProtoJson].dummyCfg.cfgReg;
                    inst.dummy_cmdRegRd = serialNorDefaultCfg.protos[defProtoJson].dummyCfg == null ? "0x00" : serialNorDefaultCfg.protos[defProtoJson].dummyCfg.cmdRegRd;
                    inst.dummy_cmdRegWr = serialNorDefaultCfg.protos[defProtoJson].dummyCfg == null ? "0x00" : serialNorDefaultCfg.protos[defProtoJson].dummyCfg.cmdRegWr;

                    inst.dummy_shift = serialNorDefaultCfg.protos[defProtoJson].dummyCfg == null ? 0 : serialNorDefaultCfg.protos[defProtoJson].dummyCfg.shift;
                    inst.dummy_mask = serialNorDefaultCfg.protos[defProtoJson].dummyCfg == null ? "0x00" : serialNorDefaultCfg.protos[defProtoJson].dummyCfg.mask;
                    inst.dummy_bitP = serialNorDefaultCfg.protos[defProtoJson].dummyCfg == null ? 0 : serialNorDefaultCfg.protos[defProtoJson].dummyCfg.bitP;


                    inst.proto_isAddrReg = serialNorDefaultCfg.protos[defProtoJson].protoCfg == null ? false : serialNorDefaultCfg.protos[defProtoJson].protoCfg.isAddrReg;
                    inst.proto_cfgReg = serialNorDefaultCfg.protos[defProtoJson].protoCfg == null ? "0x00" : serialNorDefaultCfg.protos[defProtoJson].protoCfg.cfgReg;
                    inst.proto_cmdRegRd = serialNorDefaultCfg.protos[defProtoJson].protoCfg == null ? "0x00" : serialNorDefaultCfg.protos[defProtoJson].protoCfg.cmdRegRd;
                    inst.proto_cmdRegWr = serialNorDefaultCfg.protos[defProtoJson].protoCfg == null ? "0x00" : serialNorDefaultCfg.protos[defProtoJson].protoCfg.cmdRegWr;

                    inst.proto_shift = serialNorDefaultCfg.protos[defProtoJson].protoCfg == null ? 0 : serialNorDefaultCfg.protos[defProtoJson].protoCfg.shift;
                    inst.proto_mask = serialNorDefaultCfg.protos[defProtoJson].protoCfg == null ? "0x00" : serialNorDefaultCfg.protos[defProtoJson].protoCfg.mask;
                    inst.proto_bitP = serialNorDefaultCfg.protos[defProtoJson].protoCfg == null ? 0 : serialNorDefaultCfg.protos[defProtoJson].protoCfg.bitP;

                    inst.strDtr_isAddrReg = serialNorDefaultCfg.protos[defProtoJson].strDtrCfg == null ? false : serialNorDefaultCfg.protos[defProtoJson].strDtrCfg.isAddrReg;
                    inst.strDtr_cfgReg = serialNorDefaultCfg.protos[defProtoJson].strDtrCfg == null ? "0x00" : serialNorDefaultCfg.protos[defProtoJson].strDtrCfg.cfgReg;
                    inst.strDtr_cmdRegRd = serialNorDefaultCfg.protos[defProtoJson].strDtrCfg == null ? "0x00" : serialNorDefaultCfg.protos[defProtoJson].strDtrCfg.cmdRegRd;
                    inst.strDtr_cmdRegWr = serialNorDefaultCfg.protos[defProtoJson].strDtrCfg == null ? "0x00" : serialNorDefaultCfg.protos[defProtoJson].strDtrCfg.cmdRegWr;

                    inst.strDtr_shift = serialNorDefaultCfg.protos[defProtoJson].strDtrCfg == null ? 0 : serialNorDefaultCfg.protos[defProtoJson].strDtrCfg.shift;
                    inst.strDtr_mask = serialNorDefaultCfg.protos[defProtoJson].strDtrCfg == null ? "0x00" : serialNorDefaultCfg.protos[defProtoJson].strDtrCfg.mask;
                    inst.strDtr_bitP = serialNorDefaultCfg.protos[defProtoJson].strDtrCfg == null ? 0 : serialNorDefaultCfg.protos[defProtoJson].strDtrCfg.bitP;

                    inst.cmdRdsr = serialNorDefaultCfg.cmdRdsr;
                    inst.xspiWipRdCmd = serialNorDefaultCfg.xspiWipRdCmd;
                    inst.quirks = "Flash_quirkSpansionUNHYSADisable";
                    inst.xspiWipReg = serialNorDefaultCfg.xspiWipReg;
                    inst.flashData = JSON.stringify(serialNorDefaultCfg);

                } else if(inst.flashType == "SERIAL_NAND") {
                    inst.fname = serialNandDefaultName;
                    inst.protocol = serialNandDefaultProtocolName;
                    inst.flashSize = serialNandDefaultCfg.flashSize;
                    inst.flashPageSize = serialNandDefaultCfg.flashPageSize;

                    inst.flashManfId = serialNandDefaultCfg.flashManfId;
                    inst.flashDeviceId = serialNandDefaultCfg.flashDeviceId;

                    inst.flashBlockSize = serialNandDefaultCfg.flashBlockSize;
                    inst.cmdBlockErase = serialNandDefaultCfg.cmdBlockErase;

                    inst.cmdPageLoad = serialNandDefaultCfg.cmdPageLoad;
                    inst.cmdPageProg = serialNandDefaultCfg.cmdPageProg;

                    inst.cmdRd = serialNandDefaultCfg.protos[defNandProtoJson].cmdRd,
                    inst.cmdWr = serialNandDefaultCfg.protos[defNandProtoJson].cmdWr,
                    inst.dummyClksCmd = serialNandDefaultCfg.protos[defNandProtoJson].dummyClksCmd;
                    inst.dummyClksRd = serialNandDefaultCfg.protos[defNandProtoJson].dummyClksRd;

                    inst.dummy_isAddrReg = serialNandDefaultCfg.protos[defNandProtoJson].dummyCfg == null ? false : serialNandDefaultCfg.protos[defNandProtoJson].dummyCfg.isAddrReg;
                    inst.dummy_cfgReg = serialNandDefaultCfg.protos[defNandProtoJson].dummyCfg == null ? "0x00" : serialNandDefaultCfg.protos[defNandProtoJson].dummyCfg.cfgReg;
                    inst.dummy_cmdRegRd = serialNandDefaultCfg.protos[defNandProtoJson].dummyCfg == null ? "0x00" : serialNandDefaultCfg.protos[defNandProtoJson].dummyCfg.cmdRegRd;
                    inst.dummy_cmdRegWr = serialNandDefaultCfg.protos[defNandProtoJson].dummyCfg == null ? "0x00" : serialNandDefaultCfg.protos[defNandProtoJson].dummyCfg.cmdRegWr;

                    inst.dummy_shift = serialNandDefaultCfg.protos[defNandProtoJson].dummyCfg == null ? 0 : serialNandDefaultCfg.protos[defNandProtoJson].dummyCfg.shift;
                    inst.dummy_mask = serialNandDefaultCfg.protos[defNandProtoJson].dummyCfg == null ? "0x00" : serialNandDefaultCfg.protos[defNandProtoJson].dummyCfg.mask;
                    inst.dummy_bitP = serialNandDefaultCfg.protos[defNandProtoJson].dummyCfg == null ? 0 : serialNandDefaultCfg.protos[defNandProtoJson].dummyCfg.bitP;

                    inst.proto_isAddrReg = serialNandDefaultCfg.protos[defNandProtoJson].protoCfg == null ? false : serialNandDefaultCfg.protos[defNandProtoJson].protoCfg.isAddrReg;
                    inst.proto_cfgReg = serialNandDefaultCfg.protos[defNandProtoJson].protoCfg == null ? "0x00" : serialNandDefaultCfg.protos[defNandProtoJson].protoCfg.cfgReg;
                    inst.proto_cmdRegRd = serialNandDefaultCfg.protos[defNandProtoJson].protoCfg == null ? "0x00" : serialNandDefaultCfg.protos[defNandProtoJson].protoCfg.cmdRegRd;
                    inst.proto_cmdRegWr = serialNandDefaultCfg.protos[defNandProtoJson].protoCfg == null ? "0x00" : serialNandDefaultCfg.protos[defNandProtoJson].protoCfg.cmdRegWr;

                    inst.proto_shift = serialNandDefaultCfg.protos[defNandProtoJson].protoCfg == null ? 0 : serialNandDefaultCfg.protos[defNandProtoJson].protoCfg.shift;
                    inst.proto_mask = serialNandDefaultCfg.protos[defNandProtoJson].protoCfg == null ? "0x00" : serialNandDefaultCfg.protos[defNandProtoJson].protoCfg.mask;
                    inst.proto_bitP = serialNandDefaultCfg.protos[defNandProtoJson].protoCfg == null ? 0 : serialNandDefaultCfg.protos[defNandProtoJson].protoCfg.bitP;
                    
                    inst.strDtr_isAddrReg = serialNandDefaultCfg.protos[defNandProtoJson].strDtrCfg == null ? false : serialNandDefaultCfg.protos[defNandProtoJson].strDtrCfg.isAddrReg;
                    inst.strDtr_cfgReg = serialNandDefaultCfg.protos[defNandProtoJson].strDtrCfg == null ? "0x00" : serialNandDefaultCfg.protos[defNandProtoJson].strDtrCfg.cfgReg;
                    inst.strDtr_cmdRegRd = serialNandDefaultCfg.protos[defNandProtoJson].strDtrCfg == null ? "0x00" : serialNandDefaultCfg.protos[defNandProtoJson].strDtrCfg.cmdRegRd;
                    inst.strDtr_cmdRegWr = serialNandDefaultCfg.protos[defNandProtoJson].strDtrCfg == null ? "0x00" : serialNandDefaultCfg.protos[defNandProtoJson].strDtrCfg.cmdRegWr;

                    inst.strDtr_shift = serialNandDefaultCfg.protos[defNandProtoJson].strDtrCfg == null ? 0 : serialNandDefaultCfg.protos[defNandProtoJson].strDtrCfg.shift;
                    inst.strDtr_mask = serialNandDefaultCfg.protos[defNandProtoJson].strDtrCfg == null ? "0x00" : serialNandDefaultCfg.protos[defNandProtoJson].strDtrCfg.mask;
                    inst.strDtr_bitP = serialNandDefaultCfg.protos[defNandProtoJson].strDtrCfg == null ? 0 : serialNandDefaultCfg.protos[defNandProtoJson].strDtrCfg.bitP;

                    inst.cmdRdsr = serialNandDefaultCfg.cmdRdsr;
                    inst.cmdWrsr = serialNandDefaultCfg.cmdWrsr;
                    inst.xspiWipRdCmd = serialNandDefaultCfg.xspiWipRdCmd;

                    inst.srWipReg = serialNandDefaultCfg.srWipReg;
                    inst.xspiRdsrDummy = serialNandDefaultCfg.xspiRdsrDummy;
                    inst.xspiWipReg = serialNandDefaultCfg.xspiWipReg;

                    inst.srWriteProtectReg = serialNandDefaultCfg.srWriteProtectReg;
                    inst.srWriteProtectMask = serialNandDefaultCfg.srWriteProtectMask;

                    inst.progStatusReg = serialNandDefaultCfg.progStatusReg;
                    inst.xspiProgStatusReg = serialNandDefaultCfg.xspiProgStatusReg;

                    inst.eraseStatusReg = serialNandDefaultCfg.eraseStatusReg;
                    inst.xspiEraseStatusReg = serialNandDefaultCfg.xspiEraseStatusReg;

                    inst.srProgStatus = serialNandDefaultCfg.srProgStatus;
                    inst.srEraseStatus = serialNandDefaultCfg.srEraseStatus;
                    inst.flashData = JSON.stringify(serialNandDefaultCfg);

                    inst.quirks = "Flash_quirkSpansionUNHYSADisable";
                }
                changeFlashType(inst, ui);
            }
        },
        {
            name: "fname",
            displayName: "Flash Name",
            default: soc.getDefaultFlashName(),
            placeholder: "Type your flash name here",
        },
        {
            name: "protocol",
            displayName: "Protocol",
            description: "The Flash SPI protocol to be used",
            default: soc.getDefaultProtocol().name,
            options: defaultProtocols,
            onChange: function(inst, ui) {
                let pCfg = protoToCfgMap[inst.protocol];
                if(inst.flashType == "SERIAL_NOR")
                {
                    if(serialNorDefaultCfg.protos[pCfg] != null && (inst.protocol != "custom"))
                    {
                        inst.cmdRd = serialNorDefaultCfg.protos[pCfg] == null ? "0x00": serialNorDefaultCfg.protos[pCfg].cmdRd;
                        inst.cmdWr = serialNorDefaultCfg.protos[pCfg] == null ? "0x00": serialNorDefaultCfg.protos[pCfg].cmdWr;

                        inst.dummyClksCmd = serialNorDefaultCfg.protos[pCfg] == null ? 0: serialNorDefaultCfg.protos[pCfg].dummyClksCmd;
                        inst.dummyClksRd = serialNorDefaultCfg.protos[pCfg] == null ? 0 :serialNorDefaultCfg.protos[pCfg].dummyClksRd;

                        inst.flash444Seq = serialNorDefaultCfg.protos[pCfg] == null ? "0x00" : serialNorDefaultCfg.protos[pCfg].enableSeq;
                        inst.flash888Seq = serialNorDefaultCfg.protos[pCfg] == null ? "0x00" : serialNorDefaultCfg.protos[pCfg].enableSeq;

                        if(serialNorDefaultCfg.protos[pCfg].dummyCfg != null)
                        {
                            inst.dummy_isAddrReg = serialNorDefaultCfg.protos[pCfg] == null ? false : serialNorDefaultCfg.protos[pCfg].dummyCfg.isAddrReg;
                            inst.dummy_cfgReg = serialNorDefaultCfg.protos[pCfg] == null ? "0x00" : serialNorDefaultCfg.protos[pCfg].dummyCfg.cfgReg;
                            inst.dummy_cmdRegRd = serialNorDefaultCfg.protos[pCfg] == null ? "0x00" : serialNorDefaultCfg.protos[pCfg].dummyCfg.cmdRegRd;
                            inst.dummy_cmdRegWr = serialNorDefaultCfg.protos[pCfg] == null ? "0x00" : serialNorDefaultCfg.protos[pCfg].dummyCfg.cmdRegWr;

                            inst.dummy_shift = serialNorDefaultCfg.protos[pCfg] == null ? 0 : serialNorDefaultCfg.protos[pCfg].dummyCfg.shift;
                            inst.dummy_mask = serialNorDefaultCfg.protos[pCfg]== null ? "0x00" : serialNorDefaultCfg.protos[pCfg].dummyCfg.mask;
                            inst.dummy_bitP = serialNorDefaultCfg.protos[pCfg] == null ? 0 : serialNorDefaultCfg.protos[pCfg].dummyCfg.bitP;
                        }
                        else
                        {
                            inst.dummy_isAddrReg = false;
                            inst.dummy_cfgReg = "0x00";
                            inst.dummy_cmdRegRd = "0x00";
                            inst.dummy_cmdRegWr = "0x00";

                            inst.dummy_shift = 0;
                            inst.dummy_mask = "0x00";
                            inst.dummy_bitP = 0;
                        }

                        if(serialNorDefaultCfg.protos[pCfg].protoCfg != null)
                        {
                            inst.proto_isAddrReg = serialNorDefaultCfg.protos[pCfg] == null ? false : serialNorDefaultCfg.protos[pCfg].protoCfg.isAddrReg;
                            inst.proto_cfgReg = serialNorDefaultCfg.protos[pCfg] == null ? "0x00" : serialNorDefaultCfg.protos[pCfg].protoCfg.cfgReg;
                            inst.proto_cmdRegRd = serialNorDefaultCfg.protos[pCfg] == null ? "0x00" : serialNorDefaultCfg.protos[pCfg].protoCfg.cmdRegRd;
                            inst.proto_cmdRegWr = serialNorDefaultCfg.protos[pCfg] == null ? "0x00" : serialNorDefaultCfg.protos[pCfg].protoCfg.cmdRegWr;

                            inst.proto_shift = serialNorDefaultCfg.protos[pCfg] == null ? 0 : serialNorDefaultCfg.protos[pCfg].protoCfg.shift;
                            inst.proto_mask = serialNorDefaultCfg.protos[pCfg] == null ? "0x00" : serialNorDefaultCfg.protos[pCfg].protoCfg.mask;
                            inst.proto_bitP = serialNorDefaultCfg.protos[pCfg] == null ? 0 : serialNorDefaultCfg.protos[pCfg].protoCfg.bitP;
                        }
                        else
                        {
                            inst.proto_isAddrReg = false;
                            inst.proto_cfgReg = "0x00";
                            inst.proto_cmdRegRd = "0x00";
                            inst.proto_cmdRegWr = "0x00";

                            inst.proto_shift = 0;
                            inst.proto_mask = "0x00";
                            inst.proto_bitP = 0;
                        }

                        if(serialNorDefaultCfg.protos[pCfg].strDtrCfg != null)
                        {
                            inst.strDtr_isAddrReg = serialNorDefaultCfg.protos[pCfg] == null ? false : serialNorDefaultCfg.protos[pCfg].strDtrCfg.isAddrReg;
                            inst.strDtr_cfgReg = serialNorDefaultCfg.protos[pCfg] == null ? "0x00" : serialNorDefaultCfg.protos[pCfg].strDtrCfg.cfgReg;
                            inst.strDtr_cmdRegRd = serialNorDefaultCfg.protos[pCfg] == null ? "0x00" : serialNorDefaultCfg.protos[pCfg].strDtrCfg.cmdRegRd;
                            inst.strDtr_cmdRegWr = serialNorDefaultCfg.protos[pCfg] == null ? "0x00" : serialNorDefaultCfg.protos[pCfg].strDtrCfg.cmdRegWr;

                            inst.strDtr_shift = serialNorDefaultCfg.protos[pCfg] == null ? 0 : serialNorDefaultCfg.protos[pCfg].strDtrCfg.shift;
                            inst.strDtr_mask = serialNorDefaultCfg.protos[pCfg]== null ? "0x00" : serialNorDefaultCfg.protos[pCfg].strDtrCfg.mask;
                            inst.strDtr_bitP = serialNorDefaultCfg.protos[pCfg] == null ? 0 : serialNorDefaultCfg.protos[pCfg].strDtrCfg.bitP;
                        }
                        else
                        {
                            inst.strDtr_isAddrReg = false;
                            inst.strDtr_cfgReg = "0x00";
                            inst.strDtr_cmdRegRd = "0x00";
                            inst.strDtr_cmdRegWr = "0x00";

                            inst.strDtr_shift = 0;
                            inst.strDtr_mask = "0x00";
                            inst.strDtr_bitP = 0;
                        }
                    }
                    else
                    {
                        inst.cmdRd = "0x00"
                        inst.cmdWr = "0x00"

                        inst.dummyClksCmd = 0;
                        inst.dummyClksRd = 0;

                    }
                }
                else if(inst.flashType == "SERIAL_NAND")
                {
                    if(serialNandDefaultCfg.protos[pCfg] != null && (inst.protocol != "custom"))
                    {
                        inst.cmdRd = serialNandDefaultCfg.protos[pCfg] == null ? "0x00": serialNandDefaultCfg.protos[pCfg].cmdRd;
                        inst.cmdWr = serialNandDefaultCfg.protos[pCfg] == null ? "0x00": serialNandDefaultCfg.protos[pCfg].cmdWr;

                        inst.dummyClksCmd = serialNandDefaultCfg.protos[pCfg] == null ? 0: serialNandDefaultCfg.protos[pCfg].dummyClksCmd;
                        inst.dummyClksRd = serialNandDefaultCfg.protos[pCfg] == null ? 0 :serialNandDefaultCfg.protos[pCfg].dummyClksRd;

                        if(serialNandDefaultCfg.protos[pCfg].dummyCfg != null)
                        {
                            inst.dummy_isAddrReg = serialNandDefaultCfg.protos[pCfg] == null ? false : serialNandDefaultCfg.protos[pCfg].dummyCfg.isAddrReg;
                            inst.dummy_cfgReg = serialNandDefaultCfg.protos[pCfg] == null ? "0x00" : serialNandDefaultCfg.protos[pCfg].dummyCfg.cfgReg;
                            inst.dummy_cmdRegRd = serialNandDefaultCfg.protos[pCfg] == null ? "0x00" : serialNandDefaultCfg.protos[pCfg].dummyCfg.cmdRegRd;
                            inst.dummy_cmdRegWr = serialNandDefaultCfg.protos[pCfg] == null ? "0x00" : serialNandDefaultCfg.protos[pCfg].dummyCfg.cmdRegWr;

                            inst.dummy_shift = serialNandDefaultCfg.protos[pCfg] == null ? 0 : serialNandDefaultCfg.protos[pCfg].dummyCfg.shift;
                            inst.dummy_mask = serialNandDefaultCfg.protos[pCfg] == null ? "0x00" : serialNandDefaultCfg.protos[pCfg].dummyCfg.mask;
                            inst.dummy_bitP = serialNandDefaultCfg.protos[pCfg] == null ? 0 : serialNandDefaultCfg.protos[pCfg].dummyCfg.bitP;
                        }
                        else
                        {
                            inst.dummy_isAddrReg = false;
                            inst.dummy_cfgReg = "0x00";
                            inst.dummy_cmdRegRd = "0x00";
                            inst.dummy_cmdRegWr = "0x00";

                            inst.dummy_shift = 0;
                            inst.dummy_mask = "0x00";
                            inst.dummy_bitP = 0;
                        }

                        if(serialNandDefaultCfg.protos[pCfg].protoCfg != null)
                        {
                            inst.proto_isAddrReg = serialNandDefaultCfg.protos[pCfg] == null ? false : serialNandDefaultCfg.protos[pCfg].protoCfg.isAddrReg;
                            inst.proto_cfgReg = serialNandDefaultCfg.protos[pCfg] == null ? "0x00" : serialNandDefaultCfg.protos[pCfg].protoCfg.cfgReg;
                            inst.proto_cmdRegRd = serialNandDefaultCfg.protos[pCfg] == null ? "0x00" : serialNandDefaultCfg.protos[pCfg].protoCfg.cmdRegRd;
                            inst.proto_cmdRegWr = serialNandDefaultCfg.protos[pCfg] == null ? "0x00" : serialNandDefaultCfg.protos[pCfg].protoCfg.cmdRegWr;

                            inst.proto_shift = serialNandDefaultCfg.protos[pCfg] == null ? 0 : serialNandDefaultCfg.protos[pCfg].protoCfg.shift;
                            inst.proto_mask = serialNandDefaultCfg.protos[pCfg] == null ? "0x00" : serialNandDefaultCfg.protos[pCfg].protoCfg.mask;
                            inst.proto_bitP = serialNandDefaultCfg.protos[pCfg] == null ? 0 : serialNandDefaultCfg.protos[pCfg].protoCfg.bitP;
                        }
                        else
                        {
                            inst.proto_isAddrReg = false;
                            inst.proto_cfgReg = "0x00";
                            inst.proto_cmdRegRd = "0x00";
                            inst.proto_cmdRegWr = "0x00";

                            inst.proto_shift = 0;
                            inst.proto_mask = "0x00";
                            inst.proto_bitP = 0;
                        }

                        if(serialNandDefaultCfg.protos[pCfg].strDtrCfg != null)
                        {
                            inst.strDtr_isAddrReg = serialNandDefaultCfg.protos[pCfg] == null ? false : serialNandDefaultCfg.protos[pCfg].strDtrCfg.isAddrReg;
                            inst.strDtr_cfgReg = serialNandDefaultCfg.protos[pCfg] == null ? "0x00" : serialNandDefaultCfg.protos[pCfg].strDtrCfg.cfgReg;
                            inst.strDtr_cmdRegRd = serialNandDefaultCfg.protos[pCfg] == null ? "0x00" : serialNandDefaultCfg.protos[pCfg].strDtrCfg.cmdRegRd;
                            inst.strDtr_cmdRegWr = serialNandDefaultCfg.protos[pCfg] == null ? "0x00" : serialNandDefaultCfg.protos[pCfg].strDtrCfg.cmdRegWr;

                            inst.strDtr_shift = serialNandDefaultCfg.protos[pCfg] == null ? 0 : serialNandDefaultCfg.protos[pCfg].strDtrCfg.shift;
                            inst.strDtr_mask = serialNandDefaultCfg.protos[pCfg]== null ? "0x00" : serialNandDefaultCfg.protos[pCfg].strDtrCfg.mask;
                            inst.strDtr_bitP = serialNandDefaultCfg.protos[pCfg] == null ? 0 : serialNandDefaultCfg.protos[pCfg].strDtrCfg.bitP;
                        }
                        else
                        {
                            inst.strDtr_isAddrReg = false;
                            inst.strDtr_cfgReg = "0x00";
                            inst.strDtr_cmdRegRd = "0x00";
                            inst.strDtr_cmdRegWr = "0x00";

                            inst.strDtr_shift = 0;
                            inst.strDtr_mask = "0x00";
                            inst.strDtr_bitP = 0;
                        }
                    }
                    else
                    {
                        inst.cmdRd = "0x00"
                        inst.cmdWr = "0x00"

                        inst.dummyClksCmd = 0;
                        inst.dummyClksRd = 0;

                    }
                }

                let hideLines = true;
                if(inst.protocol == "custom") {
                    hideLines = false;
                }

                let hideCustomProtocolSettings = true;

                if(inst.protocol == "custom") {
                    hideCustomProtocolSettings = false;
                }

                /* Add custom protocol settings */
                ui.customProtoFxn.hidden = hideCustomProtocolSettings;

                /* Add custom lines UI */
                ui.cmdLines.hidden = hideLines;
                ui.addrLines.hidden = hideLines;
                ui.dataLines.hidden = hideLines;

                changeFlashType(inst, ui);
            }
        },
        {
            name: "badBlockCheck",
            displayName: "Bad Block Checking",
            description: "Check if block is bad for page reads.",
            default: "No",
            options: [
                { name: "Yes" },
                { name: "No" },
            ],
            hidden: true,
        },
        {
            name: "cmdLines",
            displayName: "CMD Lines",
            description: "Number of transfer lines to be used for sending CMD",
            default: "1",
            options: [
                { name: "1" },
                { name: "2" },
                { name: "4" },
                { name: "8" },
            ],
            hidden: true,
        },
        {
            name: "addrLines",
            displayName: "ADDR Lines",
            description: "Number of transfer lines to be used for sending ADDR",
            default: "1",
            options: [
                { name: "1" },
                { name: "2" },
                { name: "4" },
                { name: "8" },
            ],
            hidden: true,
        },
        {
            name: "dataLines",
            displayName: "DATA Lines",
            description: "Number of transfer lines to be used for sending DATA",
            default: "1",
            options: [
                { name: "1" },
                { name: "2" },
                { name: "4" },
                { name: "8" },
            ],
            hidden: true,
        },
        /* Flash Config */
        {
            name: "basicFlashCfg",
            displayName: "Basic Flash Configuration",
            collapsed: false,
            config: [
                {
                    name: "flashSize",
                    displayName: "Flash Size In Bytes",
                    default: serialNorDefaultCfg.flashSize,
                    displayFormat: "dec",
                },
                {
                    name: "flashPageSize",
                    displayName: "Flash Page Size In Bytes",
                    default: serialNorDefaultCfg.flashPageSize,
                    displayFormat: "dec",
                },
                {
                    name: "flashManfId",
                    displayName: "Flash JEDEC Manufacturer ID",
                    default: serialNorDefaultCfg.flashManfId,
                },
                {
                    name: "flashDeviceId",
                    displayName: "Flash JEDEC Device ID",
                    default: serialNorDefaultCfg.flashDeviceId,
                },
                {
                    name: "cmdPageLoad",
                    displayName: "Page Load Command",
                    default: serialNandDefaultCfg.cmdPageLoad,
                    hidden: true,
                },
                {
                    name: "cmdPageProg",
                    displayName: "Page Program Command",
                    default: serialNandDefaultCfg.cmdPageProg,
                    hidden: true,
                },
                {
                    name: "eraseConfig",
                    displayName: "Erase Configurations",
                    longDescription: eraseConfigDescription,
                    config : [
                        {
                            name: "flashBlockSize",
                            displayName: "Flash Block Size In Bytes",
                            default: serialNorDefaultCfg.flashBlockSize,
                        },
                        {
                            name: "flashSectorSize",
                            displayName: "Flash Sector Size In Bytes",
                            default: serialNorDefaultCfg.flashSectorSize,
                        },
                        {
                            name: "cmdBlockErase3B",
                            displayName: "Block Erase CMD (3B)",
                            description: "Command to erase a block in 3-Byte addressing mode",
                            default: serialNorDefaultCfg.cmdBlockErase3B,
                        },
                        {
                            name: "cmdBlockErase4B",
                            displayName: "Block Erase CMD (4B)",
                            description: "Command to erase a block in 4-byte addressing mode",
                            default: serialNorDefaultCfg.cmdBlockErase4B,
                        },
                        {
                            name: "cmdSectorErase3B",
                            displayName: "Sector Erase CMD (3B)",
                            description: "Command to erase a block in 3-Byte addressing mode",
                            default: serialNorDefaultCfg.cmdSectorErase3B,
                        },
                        {
                            name: "cmdSectorErase4B",
                            displayName: "Sector Erase CMD (4B)",
                            description: "Command to erase a block in 4-byte addressing mode",
                            default: serialNorDefaultCfg.cmdSectorErase4B,
                        },
                        {
                            name: "cmdBlockErase",
                            displayName: "Block Erase CMD",
                            description: "Command to erase a block",
                            default: serialNandDefaultCfg.cmdBlockErase,
                            hidden: true,
                        }
                    ],
                },
                {
                    name: "protEnCfg",
                    displayName: "Protocol Enable Configuration",
                    config : [
                        {
                            name: "cmdRd",
                            displayName: "Read Command",
                            default: serialNorDefaultCfg.protos[defProtoJson].cmdRd,
                        },
                        {
                            name: "cmdWr",
                            displayName: "Write/Page Program Command",
                            default: serialNorDefaultCfg.protos[defProtoJson].cmdWr,
                        },
                        {
                            name: "modeClksCmd",
                            displayName: "Mode Clocks (CMD)",
                            description: "Mode clocks required while sending command",
                            default: serialNorDefaultCfg.protos[defProtoJson].modeClksCmd,
                            displayFormat: "dec",
                        },
                        {
                            name: "modeClksRd",
                            displayName: "Mode Clocks (READ)",
                            description: "Mode clocks required while reading data",
                            default: serialNorDefaultCfg.protos[defProtoJson].modeClksRd,
                            displayFormat: "dec",
                        },
                        {
                            name: "dummyClksCmd",
                            displayName: "Dummy Clocks (CMD)",
                            description: "Dummy Clocks required while sending command",
                            default: serialNorDefaultCfg.protos[defProtoJson].dummyClksCmd,
                            displayFormat: "dec",
                        },
                        {
                            name: "dummyClksRd",
                            displayName: "Dummy Clocks (READ)",
                            description: "Dummy Clocks required while reading data",
                            default: serialNorDefaultCfg.protos[defProtoJson].dummyClksRd,
                            displayFormat: "dec",
                        },
                        {
                            name: "flashQeType",
                            displayName: "Quad Enable Type",
                            description: "The type of Quad Enable supported by the flash",
                            longDescription: quadEnableDescription,
                            default: serialNorDefaultCfg.protos[defProtoJson] == null ? "0" : serialNorDefaultCfg.protos[defProtoJson].enableType,
                            options: [
                                { name : "0" },
                                { name : "1" },
                                { name : "2" },
                                { name : "3" },
                                { name : "4" },
                                { name : "5" },
                                { name : "6" },
                            ],
                        },
                        {
                            name: "flashOeType",
                            displayName: "Octal Enable Type",
                            description: "The type of octal enable supported by the flash for 1-1-8/1-8-8 mode",
                            longDescription: octalEnableDescription,
                            default: serialNorDefaultCfg.protos[defProtoJson] == null ? "0" : serialNorDefaultCfg.protos[defProtoJson].enableType,
                            options: [
                                { name : "0" },
                                { name : "1" },
                            ],
                        },
                        {
                            name: "flash444Seq",
                            displayName: "QPI Sequence",
                            description: "The type of octal enable supported by the flash for 1-1-8/1-8-8 mode",
                            longDescription: seq444Description,
                            default: serialNorDefaultCfg.protos[defProtoJson] == null ? "0x00" : serialNorDefaultCfg.protos[defProtoJson].enableSeq,
                        },
                        {
                            name: "flash888Seq",
                            displayName: "OPI Sequence",
                            description: "The type of octal enable supported by the flash for 1-1-8/1-8-8 mode",
                            longDescription: seq888Description,
                            default: serialNorDefaultCfg.protos[defProtoJson] == null ? "0x00" : serialNorDefaultCfg.protos[defProtoJson].enableSeq,
                        },
                        {
                            name: "protoCfg",
                            displayName: "Protocol Configuration",
                            collapsed: true,
                            config : [
                                {
                                    name: "proto_isAddrReg",
                                    displayName: "Config Is Using Addressed Reg",
                                    default: serialNorDefaultCfg.protos[defProtoJson].protoCfg == null ? false : serialNorDefaultCfg.protos[defProtoJson].protoCfg.isAddrReg,
                                    onChange: (inst, ui) => {
                                        changeFlashType(inst, ui);
                                    }
                                },
                                {
                                    name: "proto_cfgReg",
                                    displayName: "Address Of Config Reg",
                                    default: serialNorDefaultCfg.protos[defProtoJson].protoCfg == null ? "0x00000000" : serialNorDefaultCfg.protos[defProtoJson].protoCfg.cfgReg,
                                    hidden: serialNorDefaultCfg.protos[defProtoJson].protoCfg == null,
                                },
                                {
                                    name: "proto_cmdRegRd",
                                    displayName: "CMD To Read Config Reg",
                                    default: serialNorDefaultCfg.protos[defProtoJson].protoCfg == null ? "0x00" : serialNorDefaultCfg.protos[defProtoJson].protoCfg.cmdRegRd,
                                },
                                {
                                    name: "proto_cmdRegWr",
                                    displayName: "CMD To Write To Config Reg",
                                    default: serialNorDefaultCfg.protos[defProtoJson].protoCfg == null ? "0x00" : serialNorDefaultCfg.protos[defProtoJson].protoCfg.cmdRegWr,
                                },
                                {
                                    name: "regDataProto",
                                    displayName: "Register Data",
                                    longDescription: regDataDescription,
                                    collapsed: true,
                                    config: [
                                        {
                                            name: "proto_shift",
                                            displayName: "Data Shift Bits",
                                            default: serialNorDefaultCfg.protos[defProtoJson].protoCfg == null ? 0 : serialNorDefaultCfg.protos[defProtoJson].protoCfg.shift,
                                        },
                                        {
                                            name: "proto_mask",
                                            displayName: "Data Binary Mask",
                                            default: serialNorDefaultCfg.protos[defProtoJson].protoCfg == null ? "0x00" : serialNorDefaultCfg.protos[defProtoJson].protoCfg.mask,
                                        },
                                        {
                                            name: "proto_bitP",
                                            displayName: "Data To Be Written",
                                            default: serialNorDefaultCfg.protos[defProtoJson].protoCfg == null ? 0 : serialNorDefaultCfg.protos[defProtoJson].protoCfg.bitP,
                                        },
                                    ]
                                }
                            ]
                        },
                        {
                            name: "dummyCfg",
                            displayName: "Dummy Cycle Configuration",
                            collapsed: true,
                            config : [
                                {
                                    name: "dummy_isAddrReg",
                                    displayName: "Config Is Via Addressed Reg",
                                    default: serialNorDefaultCfg.protos[defProtoJson].dummyCfg == null ? false : serialNorDefaultCfg.protos[defProtoJson].dummyCfg.isAddrReg,
                                    onChange: (inst, ui) => {
                                        changeFlashType(inst, ui);
                                    }
                                },
                                {
                                    name: "dummy_cfgReg",
                                    displayName: "Address Of Config Reg",
                                    default: serialNorDefaultCfg.protos[defProtoJson].dummyCfg == null ? "0x00000000" : serialNorDefaultCfg.protos[defProtoJson].dummyCfg.cfgReg,
                                    hidden: serialNorDefaultCfg.protos[defProtoJson].dummyCfg == null,
                                },
                                {
                                    name: "dummy_cmdRegRd",
                                    displayName: "CMD To Read Config Reg",
                                    default: serialNorDefaultCfg.protos[defProtoJson].dummyCfg == null ? "0x00" : serialNorDefaultCfg.protos[defProtoJson].dummyCfg.cmdRegRd,
                                },
                                {
                                    name: "dummy_cmdRegWr",
                                    displayName: "CMD To Write To Config Reg",
                                    default: serialNorDefaultCfg.protos[defProtoJson].dummyCfg == null ? "0x00" : serialNorDefaultCfg.protos[defProtoJson].dummyCfg.cmdRegWr,
                                },
                                {
                                    name: "regDataDummy",
                                    displayName: "Register Data",
                                    longDescription: regDataDescription,
                                    collapsed: true,
                                    config: [
                                        {
                                            name: "dummy_shift",
                                            displayName: "Data Shift Bits",
                                            default: serialNorDefaultCfg.protos[defProtoJson].dummyCfg == null ? 0 : serialNorDefaultCfg.protos[defProtoJson].dummyCfg.shift,
                                        },
                                        {
                                            name: "dummy_mask",
                                            displayName: "Data Binary Mask",
                                            default: serialNorDefaultCfg.protos[defProtoJson].dummyCfg == null ? "0x00" : serialNorDefaultCfg.protos[defProtoJson].dummyCfg.mask,
                                        },
                                        {
                                            name: "dummy_bitP",
                                            displayName: "Data To Be Written",
                                            default: serialNorDefaultCfg.protos[defProtoJson].dummyCfg == null ? 0 : serialNorDefaultCfg.protos[defProtoJson].dummyCfg.bitP,
                                        },
                                    ]
                                }
                            ]
                        },
                        {
                            name: "strDtrCfg",
                            displayName: "STR/DTR Configuration",
                            collapsed: true,
                            config : [
                                {
                                    name: "strDtr_isAddrReg",
                                    displayName: "Config Is Via Addressed Reg",
                                    default: serialNorDefaultCfg.protos[defProtoJson].strDtrCfg == null ? false : serialNorDefaultCfg.protos[defProtoJson].strDtrCfg.isAddrReg,
                                    onChange: (inst, ui) => {
                                        changeFlashType(inst, ui);
                                    }
                                },
                                {
                                    name: "strDtr_cfgReg",
                                    displayName: "Address Of Config Reg",
                                    default: serialNorDefaultCfg.protos[defProtoJson].strDtrCfg == null ? "0x00000000" : serialNorDefaultCfg.protos[defProtoJson].strDtrCfg.cfgReg,
                                    hidden: serialNorDefaultCfg.protos[defProtoJson].strDtrCfg == null,
                                },
                                {
                                    name: "strDtr_cmdRegRd",
                                    displayName: "CMD To Read Config Reg",
                                    default: serialNorDefaultCfg.protos[defProtoJson].strDtrCfg == null ? "0x00" : serialNorDefaultCfg.protos[defProtoJson].strDtrCfg.cmdRegRd,
                                },
                                {
                                    name: "strDtr_cmdRegWr",
                                    displayName: "CMD To Write To Config Reg",
                                    default: serialNorDefaultCfg.protos[defProtoJson].strDtrCfg == null ? "0x00" : serialNorDefaultCfg.protos[defProtoJson].strDtrCfg.cmdRegWr,
                                },
                                {
                                    name: "regDataStrDtr",
                                    displayName: "Register Data",
                                    longDescription: regDataDescription,
                                    collapsed: true,
                                    config: [
                                        {
                                            name: "strDtr_shift",
                                            displayName: "Data Shift Bits",
                                            default: serialNorDefaultCfg.protos[defProtoJson].strDtrCfg == null ? 0 : serialNorDefaultCfg.protos[defProtoJson].strDtrCfg.shift,
                                        },
                                        {
                                            name: "strDtr_mask",
                                            displayName: "Data Binary Mask",
                                            default: serialNorDefaultCfg.protos[defProtoJson].strDtrCfg == null ? "0x00" : serialNorDefaultCfg.protos[defProtoJson].strDtrCfg.mask,
                                        },
                                        {
                                            name: "strDtr_bitP",
                                            displayName: "Data To Be Written",
                                            default: serialNorDefaultCfg.protos[defProtoJson].strDtrCfg == null ? 0 : serialNorDefaultCfg.protos[defProtoJson].strDtrCfg.bitP,
                                        },
                                    ]
                                }
                            ],
                        },
                        {
                            name: "customProtoFxn",
                            displayName: "Custom Protocol Fxn",
                            longDescription: customProtoDescription,
                            default: "NULL",
                            hidden: true,
                        },
                    ]
                },
            ]
        },
        /* Advanced flash configuration options - Mostly wouldn't need changes */
        {
            name: "advancedFlashCfg",
            displayName: "Advanced Flash Configuration",
            collapsed: true,
            config: [
                {
                    name: "resetType",
                    displayName: "Flash Reset Type",
                    description: "Type of reset supported by the flash",
                    longDescription: flashResetDescription,
                    default: serialNorDefaultCfg.resetType,
                },
                {
                    name: "deviceBusyType",
                    displayName: "Flash Device Busy Type",
                    description: "Way in which device's busy status maybe polled",
                    longDescription: flashBusyDescription,
                    default: serialNorDefaultCfg.deviceBusyType,
                    options : [
                        { name: "0", displayName: "FLAG SR BIT 7"},
                        { name: "1", displayName: "LEGACY POLLING OF SR"},
                    ]
                },
                {
                    name: "idCfg",
                    displayName: "JEDEC ID Read Configuration",
                    collapsed: true,
                    config: [
                        {
                            name: "cmdRdId",
                            displayName: "Read ID CMD",
                            description: "Command to read JEDEC ID",
                            default: serialNorDefaultCfg.rdIdSettings.cmd,
                        },
                        {
                            name: "rdIdAddressSzieInBytes",
                            displayName: "Address Size (bytes)",
                            description: "Number of address bytes that is required to be sent while reading ID.",
                            default: serialNorDefaultCfg.rdIdSettings.addressBytesSize
                        },
                        {
                            name: "idNumBytes",
                            displayName: "Number Of Bytes To Read",
                            default: serialNorDefaultCfg.rdIdSettings.numBytes,
                        },
                        {
                            name: "dummyId4",
                            displayName: "Number Of Dummy Cycles In Quad Mode",
                            default: serialNorDefaultCfg.rdIdSettings.dummy4,
                        },
                        {
                            name: "dummyId8",
                            displayName: "Number Of Dummy Cycles In Octal Mode",
                            default: serialNorDefaultCfg.rdIdSettings.dummy8,
                        },
                    ]
                },
                {
                    name: "cmdWren",
                    displayName: "Write Enable CMD",
                    description: "Command to enable writes",
                    default: serialNorDefaultCfg.cmdWren,
                },
                {
                    name: "cmdRdsr",
                    displayName: "Read Status Register CMD",
                    description: "Command to read the status register",
                    default: serialNorDefaultCfg.cmdRdsr,
                },
                {
                    name: "cmdWrsr",
                    displayName: "Write Status Register CMD",
                    description: "Command to write the status register",
                    default: serialNandDefaultCfg.cmdWrsr,
                    hidden: true,
                },
                {
                    name: "srWipReg",
                    displayName: "WIP Status Reg Addr",
                    default: serialNandDefaultCfg.srWipReg,
                    hidden: true,
                },
                {
                    name: "srWip",
                    displayName: "WIP Bit",
                    description: "WIP bit position in status register",
                    default: serialNorDefaultCfg.srWip,
                    displayFormat: "dec",
                },
                {
                    name: "srWel",
                    displayName: "WEL Bit",
                    description: "WEL bit position in status register",
                    default: serialNorDefaultCfg.srWel,
                    displayFormat: "dec",
                },
                {
                    name: "xspiWipRdCmd",
                    displayName: "WIP Read CMD (xSPI)",
                    description: "Command to read WIP status register (xSPI mode)",
                    default: serialNorDefaultCfg.xspiWipRdCmd,
                },
                {
                    name: "xspiWipReg",
                    displayName: "WIP Status Reg Addr (xSPI)",
                    default: serialNorDefaultCfg.xspiWipReg,
                },
                {
                    name: "xspiWipBit",
                    displayName: "WIP Bit (xSPI)",
                    description: "WIP bit position in status register (xSPI mode)",
                    default: serialNorDefaultCfg.xspiWipBit,
                    displayFormat: "dec",
                },
                {
                    name: "xspiRdsrDummy",
                    displayName: "WIP Read Status Dummy Cycle (xSPI)",
                    description: "Dummy cycles for reading WIP reg (xSPI mode)",
                    default: serialNandDefaultCfg.xspiRdsrDummy,
                    displayFormat: "dec",
                    hidden: true,
                },
                {
                    name: "cmdChipErase",
                    displayName: "Chip Erase Command",
                    description: "Command to erase the whole flash",
                    default: serialNorDefaultCfg.cmdChipErase,
                },
                {
                    name: "flashDeviceBusyTimeout",
                    displayName: "Flash Busy Timeout",
                    description: "Time to wait for flash to be ready",
                    default: serialNorDefaultCfg.flashDeviceBusyTimeout,
                    displayFormat: "dec",
                },
                {
                    name: "flashPageProgTimeout",
                    displayName: "Page Program Timeout",
                    description: "Time to wait for a page write to complete",
                    default: serialNorDefaultCfg.flashPageProgTimeout,
                    displayFormat: "dec",
                },
                {
                    name: "progStatusReg",
                    displayName: "Program Status Register Address",
                    default: serialNandDefaultCfg.progStatusReg,
                    hidden: true,
                },
                {
                    name: "xspiProgStatusReg",
                    displayName: "Program Status Register Addr (xSPI)",
                    default: serialNandDefaultCfg.progStatusReg,
                    hidden: true,
                },
                {
                    name: "srProgStatus",
                    displayName: "Program Status Bit Position",
                    description: "Program Status Bit Position In Status Register",
                    default: serialNandDefaultCfg.srProgStatus,
                    hidden: true,
                },
                {
                    name: "eraseStatusReg",
                    displayName: "Erase Status Register Address",
                    default: serialNandDefaultCfg.eraseStatusReg,
                    hidden: true,
                },
                {
                    name: "xspiEraseStatusReg",
                    displayName: "Erase Status Register Address (xSPI)",
                    default: serialNandDefaultCfg.xspiEraseStatusReg,
                    hidden: true,
                },
                {
                    name: "srEraseStatus",
                    displayName: "Erase Status Bit Position",
                    description: "Erase Status Bit Position In Status Register",
                    default: serialNandDefaultCfg.srEraseStatus,
                    hidden: true,
                },
                {
                    name: "srWriteProtectReg",
                    displayName: "Write Protection Status Reg Address",
                    default: serialNandDefaultCfg.srWriteProtectReg,
                    hidden: true,
                },
                {
                    name: "srWriteProtectMask",
                    displayName: "Write Protection Status Mask",
                    default: serialNandDefaultCfg.srWriteProtectMask,
                    hidden: true,
                },
                {
                    name: "enable4BAddr",
                    displayName: "Enable 4 Byte Addressing",
                    default: true,
                    onChange: function(inst, ui) {
                        let hide4B = true;
                        if(inst.enable4BAddr == true) {
                            hide4B = false;
                        }
                        ui.addressByteSupport.hidden = hide4B;
                        ui.fourByteEnableSeq.hidden = hide4B;
                    }
                },
                {
                    name: "fourByteAddressSupport",
                    displayName: "Four Byte Addressing",
                    longDescription: addressingModeDescription,
                    config: [
                        {
                            name: "addressByteSupport",
                            displayName: "Supported Addressing Modes",
                            default: serialNorDefaultCfg.addrByteSupport,
                        },
                        {
                            name: "fourByteEnableSeq",
                            displayName: "4 Byte Addressing Enable Sequence",
                            default: serialNorDefaultCfg.fourByteAddrEnSeq,
                        }
                    ]
                },
                {
                    name: "cmdExtType",
                    displayName: "Command Extension Type",
                    default: serialNorDefaultCfg.cmdExtType,
                    options: [
                        { name: "REPEAT"},
                        { name: "INVERSE"},
                        { name: "NONE"},
                    ]
                },
                {
                    name: "flashData",
                    default: JSON.stringify(serialNorDefaultCfg),
                    onChange: (inst, ui) => {
                        if(inst.flashType == "SERIAL_NOR")
                        {
                            serialNorDefaultCfg = JSON.parse(inst.flashData);
                            fillConfigs(inst, serialNorDefaultCfg);
                        }
                        else if(inst.flashType == "SERIAL_NAND")
                        {
                            serialNandDefaultCfg = JSON.parse(inst.flashData);
                            fillConfigs(inst, serialNandDefaultCfg);
                        }
                    },
                    hidden : true,
                }
            ]
        },
        {
            name: "autoCfgFlashGroup",
            displayName: "Automatically Configure Flash",
            collapsed: false,
            config: [
                {
                    name: "autoCfgFlashFromFile",
                    displayName: "Load Flash Config From JSON",
                    buttonText: "Load From JSON",
                    fileFilter: ".json",
                    pickDirectory: false,
                    nonSerializable: true,
                    onLaunch: (inst) => {
                        let products = system.getProducts();
                        let nodeCmd = common.getNodePath();
                        let sdkPath = "";
                        let copyScriptPath = "";

                        if (system.getOS() == "win") {
                            sdkPath = products[0].path.split("\\.metadata\\product.json")[0];
                            copyScriptPath = sdkPath + "\\source\\sysconfig\\board\\.meta\\flash\\copyutil.js";
                        } else {
                            sdkPath = products[0].path.split("/.metadata/product.json")[0];
                            copyScriptPath = sdkPath + "/source/sysconfig/board/.meta/flash/copyutil.js";
                        }
                        return {
                            command: nodeCmd,
                            args: [copyScriptPath, "$browsedFile", "$comFile"],
                            initialData: "initialData",
                            inSystemPath: true,
                        };
                    },
                    onComplete: (inst, _ui, result) => {
                        if(result.data === "error") {
                            inst.fname = "ERROR LOADING CONFIG";
                            return;
                        } else if(result.data === "initialData") {
                            inst.fname = "ERROR RUNNING SCRIPT";
                        } else {
                            let flashConfig = null;

                            try {
                                flashConfig = JSON.parse(result.data);
                            } catch (e) {
                                inst.fname = "ERROR PARSING CONFIG";
                                return;
                            }
                            /* Fill up the configurables with data from JSON file */
                            inst.flashData = JSON.stringify(flashConfig);
                            fillConfigs(inst, flashConfig);
                            return;
                        }
                    },
                },
            ],
        },
        /* Quirks */
        {
            name: "quirks",
            displayName: "Quirks Function",
            description: "Function to handle any vendor specific quirks of the flash",
            longDescription: quirksDescription,
            default: "Flash_quirkSpansionUNHYSADisable",
        },
    )

    if(common.getSocName() == "am261x" || common.getSocName() == "am263px") {
        config.push(
            {
                name: "enableFlashReset",
                displayName: "Enable Flash Reset API",
                description: "Generate the Flash Reset Function",
                default: false,
                hidden: false,
                onChange: (inst, ui) => {
                    if((inst.device == "CUSTOM_FLASH") && (inst.enableFlashReset == true)) {
                        ui.customFlashResetFxn.hidden = false;
                    }
                    else{
                        ui.customFlashResetFxn.hidden = true;
                    }
                }
            },
            {
                name: "customFlashResetFxn",
                displayName: "Flash Reset Function",
                default: "NULL",
                hidden: true,
                description: "Flash reset function to be used for custom flash",
            },
        )
    }

    return config;
}

function isValidHexString(s, n) {
    if("0x" == s.slice(0, 2)) {
        let re = new RegExp(`[0-9A-Fa-f]{${n}}`, "g");
        return (s.slice(2).length == n) && (re.test(s.slice(2)));
    } else {
        return false;
    }
}

function validateCmd(inst, cmdName, report) {
    if(!isValidHexString(inst[cmdName], 2)) {
        report.logError(`${cmdName} should be a 2 digit hexadecimal string with leading 0x, for example 0x03 !!!`, inst, cmdName);
    }
}

function validateFlashReset(inst, report) {

    if(inst.enableFlashReset) {
        if(inst.device == "TI_DEFAULT_FLASH"){
            report.logInfo("Ensure that the board interfaces (EEPROM/IO Expander) are properly configured to support the reset functionality.", inst, "enableFlashReset");
        }
        else if(inst.device == "CUSTOM_FLASH" ) {
            common.validate.checkValidCName(inst, report, "customFlashResetFxn");
            if((inst.customFlashResetFxn == "NULL") || (inst.customFlashResetFxn == "")) {
                report.logError("Flash reset function MUST be provided for custom flash", inst, "customFlashResetFxn");
            }
        }
    }
}

function validate(inst, report) {

    common.validate.checkSameFieldName(inst, "device", report);

    /* Validate flash name */
    common.validate.checkValidCName(inst, report, "fname");

    /* Validate flash size */
    if(inst.flashSize > 256*1024*1024) {
        report.logError("Maximum flash size supported is 256 MB !!!", inst, "flashSize");
    }
    if(inst.flashSize % 1024*1024) {
        report.logError("Flash size should be multiple of MB (MegaByte) !!!", inst, "flashSize");
    }

    /* Validate flash page size */
    if(inst.flashPageSize % 256) {
        report.logError("Flash page size should be multiple of 256 Bytes !!!", inst, "flashPageSize");
    }

    /* Validate flash manf ID */
    if(!isValidHexString(inst.flashManfId, 2)) {
        report.logError("Manufacturer ID should be a 2 digit hexadecimal string with leading 0x, for example 0x02 !!!", inst, "flashManfId");
    }

    /* Validate flash device ID */
    if(!isValidHexString(inst.flashDeviceId, 4)) {
        report.logError("Device ID should be a 4 digit hexadecimal string with leading 0x, for example 0x0123 !!!", inst, "flashDeviceId");
    }

    /* Validate flash block size */
    if(inst.flashBlockSize % 1024) {
        report.logError("Flash block size should be multiple of KB (KiloByte) !!!", inst, "flashBlockSize");
    }

    /* Validate flash sector size */
    if(inst.flashSectorSize % 1024) {
        report.logError("Flash sector size should be multiple of KB (KiloByte) !!!", inst, "flashSectorSize");
    }

    /* Validate commands */
    validateCmd(inst, "cmdBlockErase3B", report);
    validateCmd(inst, "cmdBlockErase4B", report);
    validateCmd(inst, "cmdSectorErase3B", report);
    validateCmd(inst, "cmdSectorErase4B", report);
    validateCmd(inst, "cmdRd", report);
    validateCmd(inst, "cmdWr", report);
    validateCmd(inst, "cmdWren", report);
    validateCmd(inst, "cmdRdsr", report);
    validateCmd(inst, "cmdChipErase", report);

    validateCmd(inst, "resetType", report);
    validateCmd(inst, "xspiWipRdCmd", report);

    if(!isValidHexString(inst.xspiWipReg, 8)) {
        report.logError("Register Address should be an 8 digit hexadecimal string with leading 0x, for example 0x00800000 !!!", inst, "xspiWipReg");
    }
    validateFlashReset(inst, report);

    common.validate.checkNumberRange(inst, report, "modeClksCmd", 0, 255, "dec");
    common.validate.checkNumberRange(inst, report, "modeClksRd", 0, 255, "dec");
    common.validate.checkNumberRange(inst, report, "dummyClksCmd", 0, 255, "dec");
    common.validate.checkNumberRange(inst, report, "dummyClksRd", 0, 255, "dec");
    common.validate.checkNumberRange(inst, report, "srWip", 0, 7, "dec");
    common.validate.checkNumberRange(inst, report, "srWel", 0, 7, "dec");
    common.validate.checkNumberRange(inst, report, "xspiWipBit", 0, 7, "dec");
    common.validate.checkNumberRange(inst, report, "flashDeviceBusyTimeout", 0, 4294967295, "dec");
    common.validate.checkNumberRange(inst, report, "flashPageProgTimeout", 0, 4294967295, "dec");
}

function moduleInstances(inst) {

    let modInstances = new Array();
    let requiredArgs = { protocol: inst.protocol };

    if(inst.protocol == "custom") {
        requiredArgs = {
            protocol: "custom",
            cmdLines: inst.cmdLines,
            addrLines: inst.addrLines,
            dataLines: inst.dataLines,
        };
    }

    modInstances.push({
        name: "peripheralDriver",
        displayName: "OSPI Driver Configuration",
        moduleName: "/drivers/ospi/ospi",
        useArray: false,
        requiredArgs: requiredArgs,
    })

    return (modInstances);
}

function fillConfigs(inst, cfg) {

    if(inst.flashType == "SERIAL_NOR")
    {
        /* Basic Config */
        serialNorDefaultCfg = cfg;
        inst.protocol = defaultProtocols[0].name;
        inst.flashSize = cfg.flashSize;
        inst.flashPageSize = cfg.flashPageSize;
        inst.flashManfId = cfg.flashManfId;
        inst.flashDeviceId = cfg.flashDeviceId;
        inst.flashBlockSize = cfg.flashBlockSize;
        inst.flashSectorSize = cfg.flashSectorSize;
        inst.cmdBlockErase3B = cfg.cmdBlockErase3B;
        inst.cmdBlockErase4B = cfg.cmdBlockErase4B;
        inst.cmdSectorErase3B = cfg.cmdSectorErase3B;
        inst.cmdSectorErase4B = cfg.cmdSectorErase4B;
        
        let pCfg = cfg.protos[protoToCfgMap[inst.protocol]];

        if(pCfg != null)
        {
            inst.cmdRd = pCfg.cmdRd;
            inst.cmdWr = pCfg.cmdWr;
            inst.modeClksCmd = pCfg.modeClksCmd;
            inst.modeClksRd = pCfg.modeClksRd;
            inst.dummyClksCmd = pCfg.dummyClksCmd;
            inst.dummyClksRd = pCfg.dummyClksRd;
            /* QE and OE bits */
            if(inst.protocol.includes("4")) {
                inst.flashQeType = pCfg.enableType;
            } else if (inst.protocol.includes("8")) {
                inst.flashOeType = pCfg.enableType;
            }
            /* 4-4-4 and 8-8-8 sequences */
            if(["4s_4s_4s", "4s_4d_4d"].includes(inst.protocol)) {
                inst.flash444Seq = pCfg.enableSeq;
            } else if(["8s_8s_8s", "8d_8d_8d"].includes(inst.protocol)) {
                inst.flash888Seq = pCfg.enableSeq;
            } else {
                inst.flash444Seq = "0x00";
                inst.flash888Seq = "0x00";
            }

            if(pCfg.protoCfg != null) {
                inst.proto_isAddrReg = pCfg.protoCfg.isAddrReg;
                inst.proto_cmdRegRd  = pCfg.protoCfg.cmdRegRd;
                inst.proto_cmdRegWr  = pCfg.protoCfg.cmdRegWr;
                inst.proto_cfgReg    = pCfg.protoCfg.cfgReg;
                inst.proto_shift     = pCfg.protoCfg.shift;
                inst.proto_mask      = pCfg.protoCfg.mask;
                inst.proto_bitP      = pCfg.protoCfg.bitP;
            } else {
                inst.proto_isAddrReg = false;
            }
            /* Dummy config */
            if(pCfg.dummyCfg != null) {
                inst.dummy_isAddrReg = pCfg.dummyCfg.isAddrReg;
                inst.dummy_cmdRegRd  = pCfg.dummyCfg.cmdRegRd;
                inst.dummy_cmdRegWr  = pCfg.dummyCfg.cmdRegWr;
                inst.dummy_cfgReg    = pCfg.dummyCfg.cfgReg;
                inst.dummy_shift     = pCfg.dummyCfg.shift;
                inst.dummy_mask      = pCfg.dummyCfg.mask;
                inst.dummy_bitP      = pCfg.dummyCfg.bitP;
            } else {
                inst.dummy_isAddrReg = false;
            }
            /* Str-Dtr config */
            if(pCfg.strDtrCfg != null) {
                inst.strDtr_isAddrReg = pCfg.strDtrCfg.isAddrReg;
                inst.strDtr_cmdRegRd  = pCfg.strDtrCfg.cmdRegRd;
                inst.strDtr_cmdRegWr  = pCfg.strDtrCfg.cmdRegWr;
                inst.strDtr_cfgReg    = pCfg.strDtrCfg.cfgReg;
                inst.strDtr_shift     = pCfg.strDtrCfg.shift;
                inst.strDtr_mask      = pCfg.strDtrCfg.mask;
                inst.strDtr_bitP      = pCfg.strDtrCfg.bitP;
            } else {
                inst.strDtr_isAddrReg = false;
            }

            /* Custom */
            if(inst.protocol == "custom") {
                if(cfg.protos.pCustom != null) {
                    if(cfg.protos.pCustom != null) {
                        inst.customProtoFxn = cfg.protos.pCustom.fxn;
                    } else {
                        inst.customProtoFxn = "NULL";
                    }
                } else {
                    inst.customProtoFxn = "NULL";
                }
            }
        }

        inst.resetType = cfg.resetType;
        inst.deviceBusyType = cfg.deviceBusyType;
        inst.cmdExtType = cfg.cmdExtType;
        inst.addressByteSupport = cfg.addrByteSupport;
        inst.cmdWren = cfg.cmdWren;
        inst.cmdRdsr = cfg.cmdRdsr;
        inst.srWip = cfg.srWip;
        inst.srWel = cfg.srWel;
        inst.xspiWipBit = cfg.xspiWipBit;
        inst.xspiWipRdCmd = cfg.xspiWipRdCmd;
        inst.xspiWipReg = cfg.xspiWipReg;
        inst.cmdChipErase = cfg.cmdChipErase;
        inst.cmdRdId = cfg.rdIdSettings.cmd;
        inst.idNumBytes = cfg.rdIdSettings.numBytes;
        inst.dummyId4 = cfg.rdIdSettings.dummy4;
        inst.dummyId8 = cfg.rdIdSettings.dummy8;

        inst.fourByteEnableSeq = cfg.fourByteAddrEnSeq;
        inst.flashDeviceBusyTimeout = cfg.flashDeviceBusyTimeout;
        inst.flashPageProgTimeout = cfg.flashPageProgTimeout;
    }
    else if(inst.flashType == "SERIAL_NAND")
    {
        /* Basic Config */
        serialNandDefaultCfg = cfg;
        inst.protocol = defaultProtocols[0].name;
        inst.flashSize = cfg.flashSize;
        inst.flashPageSize = cfg.flashPageSize;
        inst.flashManfId = cfg.flashManfId;
        inst.flashDeviceId = cfg.flashDeviceId;
        inst.flashBlockSize = cfg.flashBlockSize;
        inst.cmdBlockErase = cfg.cmdBlockErase;
        inst.cmdPageLoad = cfg.cmdPageLoad;
        inst.cmdPageProg = cfg.cmdPageProg;

        let pCfg = cfg.protos[protoToCfgMap[inst.protocol]];

        if(pCfg != null)
        {
            inst.cmdRd = pCfg.cmdRd;
            inst.cmdWr = pCfg.cmdWr;
            inst.dummyClksCmd = pCfg.dummyClksCmd;
            inst.dummyClksRd = pCfg.dummyClksRd;
            /* QE and OE bits */
            if(inst.protocol.includes("4")) {
                inst.flashQeType = pCfg.enableType;
            } else if (inst.protocol.includes("8")) {
                inst.flashOeType = pCfg.enableType;
            }
            /* 4-4-4 and 8-8-8 sequences */
            if(["4s_4s_4s", "4s_4d_4d"].includes(inst.protocol)) {
                inst.flash444Seq = pCfg.enableSeq;
            } else if(["8s_8s_8s", "8d_8d_8d"].includes(inst.protocol)) {
                inst.flash888Seq = pCfg.enableSeq;
            }
            /* Register configs */
            /* Protocol config */

            if(pCfg.protoCfg != null) {
                inst.proto_isAddrReg = pCfg.protoCfg.isAddrReg;
                inst.proto_cmdRegRd  = pCfg.protoCfg.cmdRegRd;
                inst.proto_cmdRegWr  = pCfg.protoCfg.cmdRegWr;
                inst.proto_cfgReg    = pCfg.protoCfg.cfgReg;
                inst.proto_shift     = pCfg.protoCfg.shift;
                inst.proto_mask      = pCfg.protoCfg.mask;
                inst.proto_bitP      = pCfg.protoCfg.bitP;
            } else {
                inst.proto_isAddrReg = false;
            }
            /* Dummy config */
            if(pCfg.dummyCfg != null) {
                inst.dummy_isAddrReg = pCfg.dummyCfg.isAddrReg;
                inst.dummy_cmdRegRd  = pCfg.dummyCfg.cmdRegRd;
                inst.dummy_cmdRegWr  = pCfg.dummyCfg.cmdRegWr;
                inst.dummy_cfgReg    = pCfg.dummyCfg.cfgReg;
                inst.dummy_shift     = pCfg.dummyCfg.shift;
                inst.dummy_mask      = pCfg.dummyCfg.mask;
                inst.dummy_bitP      = pCfg.dummyCfg.bitP;
            } else {
                inst.dummy_isAddrReg = false;
            }
            /* Str-Dtr config */
            if(pCfg.strDtrCfg != null) {
                inst.strDtr_isAddrReg = pCfg.strDtrCfg.isAddrReg;
                inst.strDtr_cmdRegRd  = pCfg.strDtrCfg.cmdRegRd;
                inst.strDtr_cmdRegWr  = pCfg.strDtrCfg.cmdRegWr;
                inst.strDtr_cfgReg    = pCfg.strDtrCfg.cfgReg;
                inst.strDtr_shift     = pCfg.strDtrCfg.shift;
                inst.strDtr_mask      = pCfg.strDtrCfg.mask;
                inst.strDtr_bitP      = pCfg.strDtrCfg.bitP;
            } else {
                inst.strDtr_isAddrReg = false;
            }

        }

        /* Custom */
        if(inst.protocol == "custom") {
            if(cfg.protos.pCustom != null) {
                if(cfg.protos.pCustom != null) {
                    inst.customProtoFxn = cfg.protos.pCustom.fxn;
                } else {
                    inst.customProtoFxn = "NULL";
                }
            } else {
                inst.customProtoFxn = "NULL";
            }
        }

        inst.cmdExtType = cfg.cmdExtType;
        inst.cmdWren = cfg.cmdWren;
        inst.cmdRdsr = cfg.cmdRdsr;
        inst.cmdWrsr = cfg.cmdWrsr;

        inst.srWip = cfg.srWip;
        inst.srWipReg = cfg.srWipReg;
        inst.xspiWipRdCmd = cfg.xspiWipRdCmd;
        inst.xspiWipReg = cfg.xspiWipReg;
        inst.xspiRdsrDummy = cfg.xspiRdsrDummy;

        inst.srWriteProtectReg = cfg.srWriteProtectReg;
        inst.srWriteProtectMask = cfg.srWriteProtectMask;

        inst.progStatusReg = cfg.progStatusReg;
        inst.xspiProgStatusReg = cfg.xspiProgStatusReg;

        inst.eraseStatusReg = cfg.eraseStatusReg;
        inst.xspiEraseStatusReg = cfg.xspiEraseStatusReg;

        inst.srProgStatus = cfg.srProgStatus;
        inst.srEraseStatus = cfg.srEraseStatus;

        inst.cmdRdId = cfg.rdIdSettings.cmd;
        inst.idNumBytes = cfg.rdIdSettings.numBytes;
        inst.dummyId4 = cfg.rdIdSettings.dummy4;
        inst.dummyId8 = cfg.rdIdSettings.dummy8;
    }
}

exports = flash_module;