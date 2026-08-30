import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

function CommonForm({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled,
}) {
  function renderInputsByComponentType(getControlItem) {
    let element = null;
    const value = formData[getControlItem.name] || "";

    switch (getControlItem.componentType) {
      case "input":
        element = (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            step={getControlItem.step}
            min={getControlItem.min}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );

        break;
      case "multiselect":
        element = (
          <div className="flex flex-wrap gap-2">
            {(getControlItem.options || []).map((opt) => {
              const current = formData[getControlItem.name] || [];
              const selected = current.includes(opt.id);
              return (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => {
                    const cur = formData[getControlItem.name] || [];
                    const next = cur.includes(opt.id)
                      ? cur.filter((i) => i !== opt.id)
                      : [...cur, opt.id];
                    setFormData({ ...formData, [getControlItem.name]: next });
                  }}
                  className={`px-2 py-1 rounded border ${
                    selected ? "bg-primary text-white" : ""
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        );

        break;
      case "select":
        // support custom values when allowCustom is enabled
        if (getControlItem.allowCustom) {
          const optionIds = (getControlItem.options || []).map((o) => o.id);
          const currentVal = formData[getControlItem.name] || "";
          const isCustom = currentVal && !optionIds.includes(currentVal);

          element = (
            <div>
              <Select
                onValueChange={(val) => {
                  if (val === "__other__") {
                    setFormData({
                      ...formData,
                      [getControlItem.name]: "__other__",
                      [getControlItem.name + "Custom"]:
                        formData[getControlItem.name + "Custom"] || "",
                    });
                  } else {
                    setFormData({
                      ...formData,
                      [getControlItem.name]: val,
                      [getControlItem.name + "Custom"]: undefined,
                    });
                  }
                }}
                value={isCustom ? "__other__" : value}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={getControlItem.label} />
                </SelectTrigger>
                <SelectContent>
                  {getControlItem.options && getControlItem.options.length > 0
                    ? getControlItem.options.map((optionItem) => (
                        <SelectItem key={optionItem.id} value={optionItem.id}>
                          {optionItem.label}
                        </SelectItem>
                      ))
                    : null}
                  <SelectItem key="__other__" value="__other__">
                    Other / Add New
                  </SelectItem>
                </SelectContent>
              </Select>

              {(formData[getControlItem.name] === "__other__" || isCustom) && (
                <Input
                  placeholder={`Enter New ${getControlItem.label}`}
                  value={
                    formData[getControlItem.name + "Custom"] ||
                    (isCustom ? currentVal : "")
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [getControlItem.name + "Custom"]: e.target.value,
                    })
                  }
                />
              )}
            </div>
          );
        } else {
          element = (
            <Select
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  [getControlItem.name]: value,
                })
              }
              value={value}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={getControlItem.label} />
              </SelectTrigger>
              <SelectContent>
                {getControlItem.options && getControlItem.options.length > 0
                  ? getControlItem.options.map((optionItem) => (
                      <SelectItem key={optionItem.id} value={optionItem.id}>
                        {optionItem.label}
                      </SelectItem>
                    ))
                  : null}
              </SelectContent>
            </Select>
          );
        }

        break;
      case "textarea":
        element = (
          <Textarea
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.id}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );

        break;

      default:
        element = (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );
        break;
    }

    return element;
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        {formControls.map((controlItem) => (
          <div className="grid w-full gap-1.5" key={controlItem.name}>
            <Label className="mb-1">{controlItem.label}</Label>
            {renderInputsByComponentType(controlItem)}
          </div>
        ))}
      </div>
      <Button disabled={isBtnDisabled} type="submit" className="mt-2 w-full">
        {buttonText || "Submit"}
      </Button>
    </form>
  );
}

export default CommonForm;
