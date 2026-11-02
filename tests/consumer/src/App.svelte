<script lang="ts">
  import {
    Button,
    DebouncedInput,
    SiteFooter,
    SiteHeader,
    Tooltip,
  } from '@weluvabid/iris';
  import * as Components from '@weluvabid/iris/components';
  import { Button as DirectButton } from '@weluvabid/iris/components/ui/button';
  import { createFilters } from '@weluvabid/iris/data-table';
  import { useDebounceCallback } from '@weluvabid/iris/hooks';
  import * as Lucide from '@weluvabid/iris/lucide';
  import * as SimpleIcons from '@weluvabid/iris/simple-icons';
  import { getInitialTheme } from '@weluvabid/iris/theme';

  const publicApi = [
    DebouncedInput,
    SiteFooter,
    SiteHeader,
    Tooltip,
    Components,
    DirectButton,
    createFilters,
    useDebounceCallback,
    Lucide,
    SimpleIcons,
    getInitialTheme,
  ];
</script>

<main data-api-count={publicApi.length}>
  <Button.Root>Root entry point</Button.Root>
</main>
