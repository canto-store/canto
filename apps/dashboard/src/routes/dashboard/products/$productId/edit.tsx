import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { api } from "@/lib/api";
import { createFileRoute, useRouter } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { AlertCircleIcon, ArrowLeft, ArrowRight } from "lucide-react";
import { productFormSchema, type ProductFormValues } from "@/types/product";
import { useUpdateProduct } from "@/hooks/useData";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { parseApiError } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/products/$productId/edit")({
  loader: async ({ params }) => {
    const product = await api.getProductById(Number(params.productId));
    const categories = await api.getCategories();
    return { product, categories };
  },
  gcTime: 0,
  component: EditProduct,
});

// Form schema

export default function EditProduct() {
  const { productId } = Route.useParams();
  const { product, categories } = Route.useLoaderData();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [changedFields, setChangedFields] = useState<
    Record<string, { old: any; new: any }>
  >({});
  const router = useRouter();
  const {
    mutateAsync: updateProduct,
    isPending,
    isError,
    error,
  } = useUpdateProduct();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product.name,
      description: product.description || "",
      categoryId: product.categoryId,
      status: product.status,
      rejectionReason: product.rejection?.reason || "",
    },
  });

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (form.formState.isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [form.formState.isDirty]);

  const handleNavigateAway = () => {
    if (form.formState.isDirty) {
      setShowUnsavedDialog(true);
    } else {
      router.navigate({ to: "/dashboard/products" });
    }
  };

  const getChangedFields = (data: ProductFormValues) => {
    const changes: Record<string, { old: any; new: any }> = {};

    if (data.name !== product.name) {
      changes.name = { old: product.name, new: data.name };
    }
    if (data.description !== product.description) {
      changes.description = {
        old: product.description || "",
        new: data.description,
      };
    }
    if (data.categoryId !== product.categoryId) {
      const oldCategory = categories.find(
        (c: any) => c.id === product.categoryId
      )?.name;
      const newCategory = categories.find(
        (c: any) => c.id === data.categoryId
      )?.name;
      changes.category = { old: oldCategory, new: newCategory };
    }
    if (data.status !== product.status) {
      changes.status = { old: product.status, new: data.status };
    }
    if (data.status === "REJECTED") {
      changes.rejectionReason = {
        old: product.rejectionReason || "",
        new: data.rejectionReason,
      };
    }

    return changes;
  };

  const handleSubmit = async (data: ProductFormValues) => {
    const changes = getChangedFields(data);
    setChangedFields(changes);

    if (Object.keys(changes).length > 0) {
      setShowConfirmDialog(true);
    } else {
      handleNavigateAway();
    }
  };

  const onConfirmSubmit = async () => {
    const currentValues = form.getValues();
    const changedData = Object.entries(changedFields).reduce((acc, [field]) => {
      // Map the field name back to the actual data field name
      const dataField = field === "category" ? "categoryId" : field;
      if (dataField in currentValues) {
        const key = dataField as keyof ProductFormValues;
        acc[key] = currentValues[key];
      }
      return acc;
    }, {} as Record<keyof ProductFormValues, any>);

    updateProduct({
      productId: Number(productId),
      product: changedData as ProductFormValues,
    }).then(() => {
      router.navigate({ to: "/dashboard/products" });
    });
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={handleNavigateAway}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-bold">Edit Product</h1>
      </div>
      <Form {...form}>
        {isError && (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>Unable to update product.</AlertTitle>
            <AlertDescription>
              <p>Please try again.</p>
              <p>{parseApiError(error)}</p>
            </AlertDescription>
          </Alert>
        )}
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map(
                      (category: { id: number; name: string }) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.name}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.watch("status") === "REJECTED" && (
            <FormField
              control={form.control}
              name="rejectionReason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rejection Reason</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleNavigateAway}
            >
              Cancel
            </Button>
            <Button disabled={isPending} type="submit">
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>

      {/* Confirmation dialog for save changes */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Changes</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div>
                Please review the following changes:
                <div className="mt-4 space-y-2">
                  {Object.entries(changedFields).map(([field, values]) => (
                    <div
                      key={field}
                      className="flex flex-row gap-2 items-center"
                    >
                      <span className="font-bold capitalize text-sm">
                        {field}:
                      </span>
                      <span className="text-red-500/90">
                        {values.old || "(empty)"}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                      <span className="text-green-500">
                        {values.new || "(empty)"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirmSubmit}>
              Confirm Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirmation dialog for unsaved changes */}
      <AlertDialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to leave this
              page? Your changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Stay</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                form.reset(); // Reset form state
                router.navigate({ to: "/dashboard/products" });
              }}
            >
              Leave Page
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
